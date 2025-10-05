from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from .database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    provider_id = Column(String, primary_key=True, index=True, unique=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    image = Column(String, nullable=True)

    roadmaps = relationship("Roadmap", back_populates="user")


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    roadmap_json = Column(JSONB, nullable=False)
    user_provider_id = Column(String, ForeignKey("users.provider_id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="roadmaps")