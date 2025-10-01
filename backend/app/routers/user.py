from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter()

class UserCreate(BaseModel):
    name: str
    email: str
    image: str | None = None
    provider_id: str

@router.get("/")
def get_users():
    return {"msg": "List of users"}

@router.post("/")
async def create_user(user: UserCreate):
    print("Received user:", user.dict())
    return {
        "status": "success",
        "user": user
    }