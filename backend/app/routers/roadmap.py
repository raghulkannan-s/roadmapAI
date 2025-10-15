from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session

from .. import models, schemas, database
from ..service.ai import generate_text
from uuid import UUID

router = APIRouter(prefix="/roadmap", tags=["roadmap"])

@router.get("/")
def health_check():
    return {"status": "Roadmap AI API is running"}


@router.get("/get/all", response_model=list[schemas.RoadmapResponse])
def get_roadmaps(db: Session = Depends(database.get_db)):
    roadmaps = db.query(models.Roadmap).all()
    return roadmaps


@router.get("/get/my", response_model=list[schemas.RoadmapResponse])
def get_my_roadmaps(
    Authorization: str | None = Header(None),
    db: Session = Depends(database.get_db)
):
    if not Authorization:
        print("Missing Authorization header")
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    if Authorization.startswith("Bearer "):
        token = Authorization.split(" ")[1]
    else:
        print("Invalid Authorization header format")
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    provider_id = token

    roadmaps = db.query(models.Roadmap).filter(models.Roadmap.user_id == provider_id).all()
    if not roadmaps:
        return []
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

@router.post("/generate", response_model=schemas.RoadmapResponse)
async def generate_text_route(
    request: schemas.RoadmapCreate,
    db: Session = Depends(database.get_db),
    Authorization: str | None = Header(None)
):
    if not Authorization:
        print("Missing Authorization header")
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    google_id = Authorization.split(" ")[1]
    print("Received request:", request.prompt)
    result = await generate_text(request.prompt)
    print("Generated result:", result)
    db_roadmap = models.Roadmap(
        roadmap_json=result,
        user_id=google_id,
        created_at=datetime.utcnow()
    )
    db.add(db_roadmap)
    db.commit()
    db.refresh(db_roadmap)

    return db_roadmap
