
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    name: str
    email: str
    image: str | None = None
    provider_id: str

@app.get("/")
def index():
    return "ok"

@app.get("/hello")
def hello():
    return {
        "msg": "Hey dude!"
    }

@app.post("/users")
async def create_user(user: UserCreate):
    print("Received user:", user.dict())
    return {
        "status": "success",
        "user": user
    }
