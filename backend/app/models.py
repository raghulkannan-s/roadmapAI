from sqlalchemy import Column, String
from .database import Base

class User(Base):
    __tablename__ = "users"

    provider_id = Column(String, primary_key=True, index=True, unique=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    image = Column(String, nullable=True)
