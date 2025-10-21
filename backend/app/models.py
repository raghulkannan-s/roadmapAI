from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from .database import Base
import uuid

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    provider_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    image = Column(String, nullable=True)
    limit = Column(Integer, default=3, nullable=False)

    roadmaps = relationship("Roadmap", back_populates="user")


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    roadmap_json = Column(JSONB, nullable=False)
    user_id = Column(String, ForeignKey("users.provider_id"), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False)

    user = relationship("User", back_populates="roadmaps")
