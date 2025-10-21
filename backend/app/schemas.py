from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID

class User(BaseModel):
    name: str
    email: str
    image: Optional[str] = None
    provider_id: str
    limit: int

class UserResponse(User):
    class Config:
        from_attributes = True

class Roadmap(BaseModel):
    roadmap_json: Optional[Dict[str, Any]] = None

class RoadmapCreate(Roadmap):
    prompt: str

class RoadmapResponse(BaseModel):
    id: UUID
    user_id: str
    created_at: datetime
    roadmap_json: Dict[str, Any]

    class Config:
        from_attributes = True

class RoadmapCreateResponse(BaseModel):
    id: UUID
    user_id: str
    created_at: datetime
    roadmap_json: dict
    limit: int
    class Config:
        from_attributes = True

