from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from .models import Base 

load_dotenv()
SUPABASE_DATABASE_URL = os.getenv("SUPABASE_DATABASE_URL")

engine = create_engine(
    SUPABASE_DATABASE_URL,
    pool_pre_ping = True,
    pool_recycle = 3600
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_db_and_tables():
    print("Attempting to create database tables in Supabase...")
    Base.metadata.create_all(bind=engine)
    print("Tables created/verified.")