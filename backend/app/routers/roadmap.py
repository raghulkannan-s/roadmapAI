from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from uuid import UUID
import logging

from .. import models, schemas, database
from ..service.ai import generate_text

router = APIRouter(prefix="/roadmap", tags=["roadmap"])
logger = logging.getLogger(__name__)

def extract_bearer_token(authorization: str | None) -> str:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authorization header format")
    return authorization.split(" ")[1]

@router.get("/")
def health_check():
    return {"status": "Roadmap AI API is operational"}

@router.get("/get/all", response_model=list[schemas.RoadmapResponse])
def get_roadmaps(db: Session = Depends(database.get_db)):
    return db.query(models.Roadmap).all()


@router.get("/get/my", response_model=list[schemas.RoadmapResponse])
def get_my_roadmaps(
    Authorization: str | None = Header(None),
    db: Session = Depends(database.get_db)
):
    provider_id = extract_bearer_token(Authorization)
    roadmaps = db.query(models.Roadmap).filter(models.Roadmap.user_id == provider_id).all()
    return roadmaps


@router.get("/get/{roadmap_id}", response_model=schemas.RoadmapResponse)
def get_roadmap(roadmap_id: str, db: Session = Depends(database.get_db)):
    try:
        roadmap_uuid = UUID(roadmap_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid roadmap ID format")

    roadmap = db.query(models.Roadmap).filter(models.Roadmap.id == roadmap_uuid).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return roadmap

@router.post("/generate", response_model=schemas.RoadmapCreateResponse)
async def generate_text_route(
    request: schemas.RoadmapCreate,
    db: Session = Depends(database.get_db),
    Authorization: str | None = Header(None)
):
    google_id = extract_bearer_token(Authorization)

    requesting_user = db.query(models.User).filter(models.User.provider_id == google_id).first()
    if not requesting_user:
        logger.warning("User not found: %s", google_id)
        raise HTTPException(status_code=401, detail="User not found")

    current_limit = int(getattr(requesting_user, "limit", 0))
    if current_limit <= 0:
        raise HTTPException(status_code=403, detail="Roadmap generation limit exceeded")


    logger.info("Generating roadmap for user %s", google_id)
    result = await generate_text(request.prompt)
    logger.info("AI generated roadmap for user %s", google_id)

    if result is None or "roadmap_json" not in result:
        logger.error(f"Malformed AI response for user {google_id}: {result}")
        raise HTTPException(status_code=500, detail="AI returned malformed roadmap JSON")

    if "error" in result:
        logger.warning("AI failed to generate roadmap for user %s: %s", google_id, result["error"])
        raise HTTPException(status_code=400, detail=result["error"])


    db_roadmap = models.Roadmap(
        roadmap_json=result["roadmap_json"],
        user_id=google_id,
        created_at=datetime.utcnow()
    )
    try:

        db.add(db_roadmap)
        setattr(requesting_user, "limit", current_limit - 1)
        db.commit()
        db.refresh(db_roadmap)
    except Exception as e:
        db.rollback()
        logger.error("DB commit failed: %s", e)
        raise HTTPException(status_code=500, detail="Database operation failed")

    logger.info(f"Roadmap saved for user {google_id}, remaining limit: {requesting_user.limit}")

    response = schemas.RoadmapCreateResponse(
    id=db_roadmap.id,
    user_id=db_roadmap.user_id,
    created_at=db_roadmap.created_at,
    roadmap_json=db_roadmap.roadmap_json,
    limit=requesting_user.limit
)

    return response
