# main.py

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from dotenv import load_dotenv
import os
from typing import Dict

# Database, Security, and Schema Imports
from database.database import create_db_and_tables, get_db
from database import crud, schemas
from auth.auth_service import create_access_token, verify_password, get_current_user_email
from auth.auth_service import ACCESS_TOKEN_EXPIRE_MINUTES
from ai.coach_agent import generate_investment_micro_course, run_mock_simulation, generate_financial_summary

# --- APP INITIALIZATION ---
load_dotenv()
app = FastAPI(title="Finity: The Frugal Friend Backend")

# NOTE: Tables must be created. Assuming this was done successfully with the Supabase connection.
# create_db_and_tables() 

# --- 1. AUTHENTICATION ROUTES (Amogh & Muneer's Focus) ---

@app.post("/signup", response_model=schemas.Token, tags=["Auth"])
def signup(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """User registration: hashes password and returns a JWT."""
    db_user = crud.get_user_by_email(db, email=user_data.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    db_user = crud.create_user(db=db, user=user_data)
    
    # Create the JWT token for immediate login
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": db_user.id,
        "user_email": db_user.email 
    }

@app.post("/login", response_model=schemas.Token, tags=["Auth"])
def login(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """User login: verifies credentials and returns a JWT."""
    db_user = crud.get_user_by_email(db, email=form_data.email)
    
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": db_user.id,
        "user_email": db_user.email 
    }

@app.get("/users/me", response_model=schemas.User, tags=["Users"])
def read_users_me(
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    """Protected route to verify the current user's token and return their data."""
    db_user = crud.get_user_by_email(db, email=current_user_email)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# --- 2. ONBOARDING & DATA ROUTES (Mallika Focus) ---

@app.post("/onboard", response_model=schemas.User, tags=["Data"])
def onboard_user(
    data: schemas.OnboardingData,
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    """Saves initial budget/goal data from onboarding."""
    user = crud.get_user_by_email(db, email=current_user_email)
    if not user: raise HTTPException(status_code=404, detail="User not found")
        
    updated_user = crud.update_onboarding_data(db, user_id=user.id, data=data)
    return updated_user

@app.post("/expenses", response_model=schemas.Expense, tags=["Data"])
def create_expense(
    expense: schemas.ExpenseCreate,
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    """Fast Expense Logging: Logs a new expense for the current user."""
    user = crud.get_user_by_email(db, email=current_user_email)
    if not user: raise HTTPException(status_code=404, detail="User not found")
    
    return crud.create_expense(db=db, expense=expense, user_id=user.id)

# --- 3. AI & SUMMARY ROUTES (Core Innovation) ---
# main.py (Add to Section 3: AI & SUMMARY ROUTES)

@app.get("/gamification/streak", tags=["Gamification"])
def get_user_streak(
    db: Session = Depends(get_db), 
    current_user_email: str = Depends(get_current_user_email)
):
    """Returns the user's current expense logging streak."""
    user = crud.get_user_by_email(db, email=current_user_email)
    if not user: raise HTTPException(status_code=404, detail="User not found")
        
    streak_count = crud.calculate_consecutive_days_logged(db, user_id=user.id)
    
    return {"streak": streak_count}

@app.get("/market/live-feed", tags=["AI"])
def get_mock_market_feed(
    current_user_email: str = Depends(get_current_user_email)
):
    """
    Mocks a real-time market feed and paper trading portfolio summary.
    This demonstrates the capability without real API integration.
    """
    # NOTE: This uses hardcoded, structured data for a compelling frontend demo.
    
    mock_data = {
        "portfolio_name": "Frugal Growth Portfolio (Paper)",
        "current_return_percent": "+4.8%", # Mocked data
        "current_market_data": [
            {"symbol": "MSFT", "price": 400.25, "change": "+1.2%", "shares": 10},
            {"symbol": "GOOG", "price": 175.50, "change": "-0.5%", "shares": 15},
            {"symbol": "TSLA", "price": 190.10, "change": "+0.8%", "shares": 5},
        ],
        "last_update": datetime.now().isoformat()
    }
    return mock_data

# main.py (Add to Section 3: AI & SUMMARY ROUTES)

@app.get("/gamification/daily-prompt", tags=["Gamification"])
def get_daily_checkin_prompt(
    db: Session = Depends(get_db), 
    current_user_email: str = Depends(get_current_user_email)
):
    """
    Delivers a randomized, gamified prompt to encourage manual expense logging.
    (Content provided by Deepak/Ayush)
    """
    # Example content pool (Deepak and Ayush's task is to populate this)
    prompts = [
        {"type": "Challenge", "text": "🛑 Your 'Fun Money' budget is getting tight! Log your last expense to see if you're still in the green zone."},
        {"type": "Reward", "text": "✨ Earn a 'Discipline Badge'! Enter your spending quickly to protect your current 3-day logging streak."},
        {"type": "Curiosity", "text": "🔍 Time for today's Money Moment: What was the one unexpected cost today? Log it now to keep your dashboard clear!"}
    ]
    
    # Return a random prompt to keep the app fresh
    return random.choice(prompts)

@app.get("/summary/coach", tags=["AI"])
def get_coach_summary(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    """Generates the AI-Powered Summary based on user expenses."""
    user = crud.get_user_by_email(db, email=current_user_email)
    if not user: raise HTTPException(status_code=404, detail="User not found")

    # Retrieve user's last 50 expenses
    expenses = crud.get_user_expenses(db, user_id=user.id, limit=50)
    
    # Prepare data for LLM analysis
    expense_data = [{"amount": e.amount, "category": e.category, "note": e.note} for e in expenses]
    
    user_data = {
        "fixed_budget": user.fixed_budget,
        "financial_confidence": user.financial_confidence,
        "goal_name": "Emergency Fund", # Simplification for MVP
    }
    
    # Call the Gemini Agent
    summary_text = generate_financial_summary(user_data, expense_data)
    
    return {"summary": summary_text}

@app.post("/simulate/invest", tags=["AI"])
def simulate_investment(
    simulation_input: schemas.SimulatorInput, 
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    """Runs a mock investment simulation and returns AI-generated micro-course."""
    user = crud.get_user_by_email(db, email=current_user_email)
    if not user: raise HTTPException(status_code=404, detail="User not found")
        
    # 1. Run the structured backend calculation
    result = run_mock_simulation(
        start=simulation_input.start,
        monthly=simulation_input.monthly,
        years=simulation_input.years,
        risk=simulation_input.risk
    )
    
    # 2. Generate AI course content
    user_data = {
        "financial_confidence": user.financial_confidence,
        "goal_name": "Investment Exploration"
    }

    course_content = generate_investment_micro_course(user_data, result)
    
    # 3. Save the session data to the database
    # Create a Pydantic object for saving, adding the course content and projected value
    session_schema = schemas.SimulatorSession(
        start_amount=result['start_amount'],
        monthly_contribution=result['monthly_contribution'],
        risk_level=simulation_input.risk,
        course_summary=course_content, 
        projected_value=result['projected_final_value']
    )
    
    crud.create_simulator_session(db, session_data=session_schema, user_id=user.id)
    
    return {
        "simulation_result": result,
        "course_content": course_content
    }

# database/crud.py (Add to the end of the file)

from datetime import date, timedelta
from typing import Optional

def calculate_consecutive_days_logged(db: Session, user_id: int) -> int:
    """Calculates the user's current consecutive logging streak."""
    
    today = date.today()
    streak = 0
    
    # Query all unique dates the user has logged an expense, ordered descending
    logged_dates = db.query(models.Expense.date.cast(date)).filter(
        models.Expense.owner_id == user_id
    ).distinct().order_by(models.Expense.date.desc()).all()
    
    logged_dates = {d[0] for d in logged_dates} # Convert to set of dates for fast lookup
    
    # Check if the user logged today (or yesterday, depending on the current time)
    current_day = today
    
    # Loop backward to calculate the streak
    while current_day in logged_dates:
        streak += 1
        current_day -= timedelta(days=1)
        
    return streak


# --- 4. RUN SERVER (Development Only) ---
if __name__ == "__main__":
    import uvicorn
    # This command starts the server
    uvicorn.run(app, host="0.0.0.0", port=8000)

