from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, database
import logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/get/all", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(database.get_db)):
    users = db.query(models.User).all()
    if not users:
        return []
    return users

@router.post("/signup", response_model=schemas.UserResponse)
def create_user(user: schemas.User, db: Session = Depends(database.get_db)):

    user_exists = db.query(models.User).filter(models.User.email == user.email).first()

    if user_exists:
        logger.info(f"User logged in: {user.email} \n Provider ID: {user.provider_id} \n limit: {user_exists.limit}")
        return user_exists

    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
