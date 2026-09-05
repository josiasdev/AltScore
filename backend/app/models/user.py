from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, ForeignKey
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default="tenant")
    solana_public_key = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    address = Column(String)
    neighborhood = Column(String)
    rent_value = Column(Float)
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    area_m2 = Column(Integer)
    description = Column(String)
    accepts_altscore = Column(Boolean, default=True)
    image_url = Column(String)
    landlord_name = Column(String)


class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    total = Column(Integer)
    payment_score = Column(Integer)
    income_score = Column(Integer)
    finance_score = Column(Integer)
    social_score = Column(Integer)
    level = Column(String)
    connected_sources = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    tenant_id = Column(Integer, ForeignKey("users.id"))
    landlord_id = Column(Integer, nullable=True)
    rent_value = Column(Float)
    status = Column(String, default="pending")
    start_date = Column(DateTime, default=datetime.utcnow)
    solana_tx_hash = Column(String, nullable=True)
