# database/crud.py (Production Ready Code)

from sqlalchemy.orm import Session
from . import models, schemas
from auth.auth_service import get_password_hash, verify_password # Centralized security service
from typing import List

# --- USER CRUD (Read and Create) ---

def get_user_by_email(db: Session, email: str):
    """Fetches a user by their unique email."""
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    """Fetches a user by their primary key ID."""
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    """Creates a user and securely hashes the password."""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- ONBOARDING & GOAL CRUD (Create and Update) ---

def update_onboarding_data(db: Session, user_id: int, data: schemas.OnboardingData):
    """Updates user budget and creates user goals based on onboarding input."""
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None
        
    db_user.fixed_budget = data.fixed_budget
    db_user.financial_confidence = data.financial_confidence
    
    # Delete existing goals (to prevent duplicates on re-onboarding)
    db.query(models.Goal).filter(models.Goal.user_id == user_id).delete()
    
    # Create new Goals for the user
    for goal_data in data.goals_data:
        db_goal = models.Goal(
            name=goal_data['name'], 
            target_amount=goal_data['target'], 
            user_id=user_id,
            current_amount=0.0 # Goals start at zero
        )
        db.add(db_goal)
        
    db.commit()
    db.refresh(db_user)
    return db_user
    
def get_user_goals(db: Session, user_id: int) -> List[models.Goal]:
    """Retrieves all goals for a user."""
    return db.query(models.Goal).filter(models.Goal.user_id == user_id).all()

# --- EXPENSE CRUD (Create and Read) ---

def create_expense(db: Session, expense: schemas.ExpenseCreate, user_id: int):
    """Logs a new expense linked to a user."""
    # Use expense.model_dump() for Pydantic v2 compatibility
    db_expense = models.Expense(**expense.model_dump(), owner_id=user_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_user_expenses(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """Retrieves a user's expense history (reverse chronological order is best for coach)."""
    return db.query(models.Expense).filter(models.Expense.owner_id == user_id).order_by(models.Expense.date.desc()).offset(skip).limit(limit).all()

# --- SIMULATOR CRUD (Create) ---

def create_simulator_session(db: Session, session_data: schemas.SimulatorSession, user_id: int):
    """Saves the result of a simulation and the AI-generated course content."""
    # Note: We need to convert the Pydantic schema back to a dictionary and add user_id
    data_dict = session_data.model_dump(exclude_unset=True)
    db_session = models.SimulatorSession(**data_dict, user_id=user_id)
    
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session