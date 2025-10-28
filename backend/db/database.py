# DB connection and session helper
# Author: Amogh

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, Float, String, Date

# SQLite Database URL (saves to a file named 'app.db')
SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"

# Connect to the database
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a SessionLocal class to get a database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for your DB models
Base = declarative_base()

# --- ORM MODEL (DB Table Definition) ---


class DBTransaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)  # Simple dummy user ID for hackathon
    amount = Column(Float)
    category = Column(String)
    note = Column(String, nullable=True)
    date = Column(Date)

# Function to create all tables (call this once on startup)


def init_db():
    Base.metadata.create_all(bind=engine)

# Dependency to get the DB session (used in routes)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
