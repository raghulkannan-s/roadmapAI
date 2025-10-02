from pydantic import BaseModel

class User(BaseModel):
    name: str
    email: str
    image: str | None = None
    provider_id: str

class UserResponse(User):
    class Config:
        orm_mode = True
