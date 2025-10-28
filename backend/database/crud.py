# database/crud.py (Production Ready Code)

from sqlalchemy.orm import Session
from . import models, schemas
from auth.auth_service import get_password_hash, verify_password # Centralized security service
from typing import List
from datetime import date, timedelta, datetime
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import Date
from ai.coach_agent import STATIC_ASSET_HISTORY
from fastapi import HTTPException, status

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

    db_user.age = data.age
    db_user.occupation = data.occupation
    db_user.monthly_income = data.monthly_income
    db_user.risk_tolerance = data.risk_tolerance
    db_user.monthly_expenses = data.monthly_expenses
    db_user.current_savings = data.current_savings
    db_user.loan_amount = data.loan_amount
    db_user.current_investment = data.current_investment
    db_user.experience_level = data.experience_level
    
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
    """Logs a new expense linked to a user, using provided date if available."""
    
    # Convert Pydantic object to dict
    expense_data = expense.model_dump()
    
    # If the user provided a date (which will be a Python date object from Pydantic), 
    # we convert it to a full datetime object for the database (PostgreSQL DATETIME requires time).
    if expense_data.get('date'):
        # Convert date to datetime at midnight (00:00:00)
        expense_data['date'] = datetime.combine(expense_data['date'], datetime.min.time())
    else:
        # If no date provided, use the current time
        expense_data['date'] = datetime.utcnow()
        
    # Remove the 'note' key if it's None to clean up the dict for model instantiation
    if expense_data.get('note') is None:
        del expense_data['note']
    
    # Instantiate the model, carefully passing only required arguments
    db_expense = models.Expense(
        amount=expense_data['amount'],
        category=expense_data['category'],
        date=expense_data['date'],
        note=expense_data.get('note'),
        owner_id=user_id
    )
    
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

def calculate_consecutive_days_logged(db: Session, user_id: int) -> int:
    """Calculates the user's current consecutive logging streak."""
    
    today = date.today()
    streak = 0
    
    # 1. Define the casted column expression
    casted_date_column = models.Expense.date.cast(Date).label('expense_date_only')

    # 2. Query only the DISTINCT casted column, and ORDER BY the casted column
    logged_dates_results = db.query(casted_date_column).filter(
        models.Expense.owner_id == user_id
    ).distinct(
    ).order_by(casted_date_column.desc() # FIX: Ordering by the casted value
    ).all()
    
    # Extract just the date objects from the result tuples
    logged_dates = {d[0] for d in logged_dates_results} 
    
    current_day = today
    
    # Loop backward to calculate the streak
    while current_day in logged_dates:
        streak += 1
        current_day -= timedelta(days=1)
        
    return streak

def check_for_min_contribution_session(db: Session, user_id: int, min_amount: float = 50.0) -> bool:
    """Checks if the user has completed the simulator assignment (Lesson 2 criteria)."""
    session = db.query(models.SimulatorSession).filter(
        models.SimulatorSession.user_id == user_id,
        models.SimulatorSession.monthly_contribution >= min_amount
    ).first()
    return session is not None

def count_unique_expense_categories(db: Session, user_id: int) -> int:
    """Counts the number of unique categories logged (Lesson 3 criteria)."""
    return db.query(models.Expense.category).filter(
        models.Expense.owner_id == user_id
    ).distinct().count()

def advance_user_lesson_progress(db: Session, user_id: int):
    """Increments the user's lesson progress counter."""
    user = get_user_by_id(db, user_id)
    if user:
        user.lesson_progress += 1
        db.commit()
        db.refresh(user)
    return user

def create_simulator_session(db: Session, session_data: schemas.SimulatorSession, user_id: int):
    """Saves the result of a simulation and the AI-generated course content."""
    data_dict = session_data.model_dump(exclude_unset=True)
    db_session = models.SimulatorSession(**data_dict, user_id=user_id)
    
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_current_mock_price(symbol: str) -> float:
    """Retrieves a stable mock price for a symbol based on the latest history point."""
    
    # Get the mock history data (list of 10 dicts)
    history = STATIC_ASSET_HISTORY.get(symbol.upper(), [])
    
    if history:
        # Return the latest price point (the last item in the list)
        return history[-1]['price']
        
    # Default to a base price if the symbol is not in the mock store
    return 100.00

def get_asset_in_portfolio(db: Session, user_id: int, symbol: str):
    """Retrieves a specific asset from the user's portfolio."""
    return db.query(models.Portfolio).filter(
        models.Portfolio.user_id == user_id, 
        models.Portfolio.symbol == symbol.upper()
    ).first()

def get_user_portfolio_holdings(db: Session, user_id: int) -> List[models.Portfolio]:
    """Retrieves all assets held by the user in their paper portfolio."""
    return db.query(models.Portfolio).filter(
        models.Portfolio.user_id == user_id,
        models.Portfolio.shares > 0  # Only return assets currently held
    ).all()

def update_portfolio_shares(db: Session, user_id: int, symbol: str, amount: float, action: str):
    
    symbol = symbol.upper()
    asset = get_asset_in_portfolio(db, user_id, symbol)
    current_price = get_current_mock_price(symbol)
    shares_to_trade = amount / current_price
    
    if action == "Buy":
        if not asset:
            # 1. NEW ASSET: Create the object and add it to the session
            asset = models.Portfolio(
                user_id=user_id, symbol=symbol, shares=shares_to_trade, average_cost=current_price
            )
            db.add(asset)
        else:
            # 2. EXISTING ASSET: Update existing object properties
            new_total_cost = (asset.shares * asset.average_cost) + amount
            new_total_shares = asset.shares + shares_to_trade
            asset.average_cost = new_total_cost / new_total_shares
            asset.shares = new_total_shares
            
    elif action == "Sell":
        if not asset:
             # FIX 1: If asset doesn't exist to sell, raise the HTTP Exception immediately.
             # This prevents the db.refresh(None) error.
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You do not hold any shares of this asset.")
        
        if asset.shares < shares_to_trade:
             # FIX 2: If asset exists but shares are insufficient, raise HTTP Exception.
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot sell more shares than currently held.")
        
        # Update shares for successful sale
        asset.shares -= shares_to_trade
        if asset.shares < 0.0001: 
            asset.shares = 0.0
            
    else:
        # If the action is neither Buy nor Sell
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid action type: {action}")

    # CRITICAL PERSISTENCE BLOCK: Commit the transaction
    try:
        db.commit() 
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Transaction failed during commit: {e}")

    # After a successful commit, the asset is persistent. Refresh and return it.
    db.refresh(asset) 
    
    return asset

def create_income(db: Session, income: schemas.IncomeCreate, user_id: int):
    """Logs a new income entry linked to a user."""
    
    income_data = income.model_dump()
    
    # Process date: use user-provided date (converted to datetime) or default to now
    if income_data.get('date'):
        income_data['date'] = datetime.combine(income_data['date'], datetime.min.time())
    else:
        income_data['date'] = datetime.utcnow()
    
    db_income = models.Income(
        amount=income_data['amount'],
        source=income_data['source'],
        date=income_data['date'],
        owner_id=user_id
    )
    
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income

def get_user_incomes(db: Session, user_id: int, limit: int = 50):
    """Retrieves a user's income history for analysis."""
    return db.query(models.Income).filter(
        models.Income.owner_id == user_id
    ).order_by(models.Income.date.desc()).limit(limit).all()