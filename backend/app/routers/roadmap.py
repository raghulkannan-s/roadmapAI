from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, database
from ..service.ai import generate_text

router = APIRouter(prefix="/roadmap", tags=["roadmap"])


@router.get("/")
def health_check():
    return {"status": "Roadmap AI API is running"}


@router.get("/get/all", response_model=list[schemas.RoadmapResponse])
def get_roadmaps(db: Session = Depends(database.get_db)):
    roadmaps = db.query(models.Roadmap).all()
    return roadmaps


@router.post("/generate", response_model=schemas.RoadmapResponse)
async def generate_text_route(
    request: schemas.RoadmapCreate,
    db: Session = Depends(database.get_db)
):
    result = await generate_text(request.prompt)

    db_roadmap = models.Roadmap(
        roadmap_json=result,
        user_provider_id=request.user_provider_id,
    )
    db.add(db_roadmap)
    db.commit()
    db.refresh(db_roadmap)

    return db_roadmap
