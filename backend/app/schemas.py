from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID

# User Schemas
class User(BaseModel):
    name: str
    email: str
    image: str | None = None
    provider_id: str

class UserResponse(User):
    class Config:
        from_attributes = True

# Roadmap Schemas
class Roadmap(BaseModel):
    roadmap_json: Optional[Dict[str, Any]] = None

class RoadmapCreate(Roadmap):
    user_provider_id: str
    prompt: str

class RoadmapResponse(BaseModel):
    id: UUID
    user_provider_id: str
    created_at: datetime
    roadmap_json: Dict[str, Any]

    class Config:
        from_attributes = True