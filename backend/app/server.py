from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi.responses import JSONResponse
import logging

from .config import settings
from .routers import roadmap, user
from .database import engine, Base

Base.metadata.create_all(bind=engine)

from logging.handlers import RotatingFileHandler
import logging

handler = RotatingFileHandler(
    "app.log", maxBytes=5*1024*1024, backupCount=3
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[handler, logging.StreamHandler()]
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request, exc):
    return JSONResponse(status_code=429, content={"detail": "Too many requests, slow down."})

@app.get("/ping")
@limiter.limit("5/minute")
def ping(request):
    return {"msg": "pong"}

@app.get("/")
def index():
    return {"msg": "Hey dude!"}

app.include_router(user.router)
app.include_router(roadmap.router)
