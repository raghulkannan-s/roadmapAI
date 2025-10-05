from pydantic import BaseModel
from datetime import datetime

class User(BaseModel):
    name: str
    email: str
    image: str | None = None
    provider_id: str

class UserResponse(User):
    class Config:
        from_attributes = True


class Roadmap(BaseModel):
    roadmap_json: str | None = None

class RoadmapCreate(Roadmap):
    user_provider_id: str
    prompt: str
class RoadmapResponse(Roadmap):
    id: int
    user_provider_id: str
    created_at: datetime

    class Config:
        from_attributes = True