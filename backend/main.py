# main.py

from fastapi import FastAPI, Depends, HTTPException, status
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from dotenv import load_dotenv
import os
import json
import random
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()

# Database, Security, and Schema Imports
from database.database import create_db_and_tables, get_db
from database import crud, schemas
from auth.auth_service import create_access_token, verify_password, get_current_user_email
from auth.auth_service import ACCESS_TOKEN_EXPIRE_MINUTES
from ai.coach_agent import generate_investment_micro_course, run_mock_simulation, get_chat_response, get_mock_asset_history, generate_next_lesson, ASSET_CATALOG

origins = [value.strip() for value in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",") if value.strip()]
# --- APP INITIALIZATION ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="Finity paper trading demo", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Use the specific origins list instead of "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- TEST/DEBUG ROUTES ---
@app.get("/", tags=["Debug"])
def root():
    """Health check and CORS verification endpoint."""
    return {
        "status": "running",
        "cors_origins": origins,
        "message": "Finity local paper trading API"
    }

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

@app.patch("/users/me", response_model=schemas.User, tags=["Users"])
def update_users_me(data: schemas.ProfileUpdate, db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    user = crud.get_user_by_email(db, current_user_email)
    if not user: raise HTTPException(status_code=404, detail="User not found")
    if data.age is not None and not 13 <= data.age <= 120:
        raise HTTPException(status_code=400, detail="Age must be between 13 and 120")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

@app.post("/achievements", tags=["Users"])
def save_achievement(data: schemas.AchievementCreate, db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    user = crud.get_user_by_email(db, current_user_email)
    if not user: raise HTTPException(status_code=404, detail="User not found")
    achievements = json.loads(user.achievements or "[]")
    if not any(item.get("name") == data.name for item in achievements):
        achievements.append(data.model_dump())
        user.achievements = json.dumps(achievements)
        db.commit()
    return {"achievements": achievements}

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
    user = crud.get_user_by_email(db, email=current_user_email)
    if not user: raise HTTPException(status_code=404, detail="User not found")
    
    # MODIFICATION: Pass the expense object directly (Pydantic handles the Optional field)
    return crud.create_expense(db=db, expense=expense, user_id=user.id)

@app.get("/expenses", response_model=list[schemas.Expense], tags=["Data"])
def list_expenses(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    user = crud.get_user_by_email(db, current_user_email)
    if not user: raise HTTPException(status_code=404, detail="User not found")
    return crud.get_user_expenses(db, user.id)

@app.delete("/expenses/{entry_id}", status_code=204, tags=["Data"])
def delete_expense(entry_id: int, db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    user = crud.get_user_by_email(db, current_user_email)
    entry = db.query(crud.models.Expense).filter_by(id=entry_id, owner_id=user.id).first()
    if not entry: raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(entry)
    db.commit()

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
    db: Session = Depends(get_db), 
    current_user_email: str = Depends(get_current_user_email)
):
    """
    Fetches the user's actual portfolio holdings from the DB and calculates
    their real-time mocked value (Paper Trading).
    """
    user = crud.get_user_by_email(db, email=current_user_email)
    if not user: raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # 1. Retrieve the user's held assets
    holdings = crud.get_user_portfolio_holdings(db, user.id)
    
    portfolio_summary = []
    total_market_value = 0.0

    for asset in holdings:
        # 2. Get the current mock price from the stable source (defined in crud.py)
        current_price = crud.get_current_mock_price(asset.symbol)
        
        # 3. Calculate metrics
        current_value = asset.shares * current_price
        total_market_value += current_value
        
        # Calculate Gain/Loss Percentage
        if asset.average_cost > 0:
            gain_loss_percent = ((current_price - asset.average_cost) / asset.average_cost) * 100
        else:
            gain_loss_percent = 0.0
            
        portfolio_summary.append({
            "symbol": asset.symbol,
            "shares": round(asset.shares, 4),
            "current_price": round(current_price, 2),
            "average_cost": round(asset.average_cost, 2),
            "current_value": round(current_value, 2),
            "gain_loss_percent": round(gain_loss_percent, 2)
        })

    # 4. Return the dynamic summary
    return {
        "total_portfolio_value": round(total_market_value, 2),
        "available_balance": round(user.cash_balance, 2),
        "available_stocks": [asset for asset in ASSET_CATALOG if asset["type"] == "Stock"],
        "available_mutual_funds": [asset for asset in ASSET_CATALOG if asset["type"] == "Mutual Fund"],
        "holdings": portfolio_summary,
        "last_update": datetime.now().isoformat()
    }

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

@app.post("/chat", tags=["AI"])
def handle_chat(
    chat_message: schemas.ChatMessage,
    # NOTE: chat_history should be passed by Muneer's frontend
    db: Session = Depends(get_db), 
    current_user_email: str = Depends(get_current_user_email)
):
    response_text = get_chat_response(chat_message.message, chat_message.history[-12:])
    return {"reply": response_text}

@app.post("/simulate/invest/action", tags=["AI"])
def simulate_investment_action(
    action_data: schemas.InvestmentAction,
    db: Session = Depends(get_db), 
    current_user_email: str = Depends(get_current_user_email)
):
    user = crud.get_user_by_email(db, email=current_user_email)
    if not user: raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    result = crud.update_portfolio_shares(db, user.id, action_data.symbol, action_data.amount, action_data.action)
    return {"status": "success", "message": f"Paper {action_data.action.lower()} completed for {action_data.amount:g} shares of {action_data.symbol.upper()}.", **result}

@app.post("/simulate/invest/learn", tags=["AI"])
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

@app.get("/market/asset-history/{symbol}", tags=["AI"])
def get_asset_history(
    symbol: str, 
    # FIX IS HERE: Inject the database dependency
    db: Session = Depends(get_db), 
    current_user_email: str = Depends(get_current_user_email)
):
    """Provides historical data for charting (now from static mock store)."""
    
    # 1. Verification and DB Check
    user = crud.get_user_by_email(db, email=current_user_email) # 'db' is now defined!
    if not user: 
        # Since auth passed, this user should exist, but it's good practice
        raise HTTPException(status_code=404, detail="User not found") 
        
    # 2. Retrieve data from the new static store
    history = get_mock_asset_history(symbol.upper())
    
    if not history:
        raise HTTPException(status_code=404, detail=f"Asset symbol '{symbol}' not found in mock store.")
        
    return {"symbol": symbol, "history": history}

@app.get("/course/next-lesson", response_model=schemas.LessonContent, tags=["AI"])
def get_next_lesson_route(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    user = crud.get_user_by_email(db, email=current_user_email)
    if not user: raise HTTPException(status_code=404, detail="User not found")
        
    lesson_data = generate_next_lesson(
        user_data={"fixed_budget": user.fixed_budget, "financial_confidence": user.financial_confidence}, 
        lesson_index=user.lesson_progress + 1
    )
    
    # Check if the next lesson criteria is met (Backend check)
    is_unlocked = check_assignment_status(db, user.id, lesson_data['unlock_criteria_key'])
    
    return schemas.LessonContent(**lesson_data, is_unlocked=is_unlocked) # Note: Requires adding is_unlocked to LessonContent schema if used

@app.post("/course/complete-lesson", response_model=schemas.User, tags=["AI"])
def complete_lesson(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    user = crud.get_user_by_email(db, email=current_user_email)
    if not user: raise HTTPException(status_code=404, detail="User not found")
    
    current_lesson_index = user.lesson_progress + 1
    if current_lesson_index > 3:
        raise HTTPException(status_code=400, detail="All demo lessons completed")
    lesson = generate_next_lesson({"fixed_budget": user.fixed_budget, "financial_confidence": user.financial_confidence}, current_lesson_index)
    if check_assignment_status(db, user.id, lesson['unlock_criteria_key']):
        return crud.advance_user_lesson_progress(db, user.id)
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Assignment not complete. Keep tracking your expenses!")

def check_assignment_status(db: Session, user_id: int, criteria_key: str) -> bool:
    """Helper function to check if the assignment criteria is met."""
    if criteria_key == 'consecutive_logs_3':
        return crud.calculate_consecutive_days_logged(db, user_id) >= 3
    if criteria_key == 'simulator_run_min_50':
        return crud.check_for_min_contribution_session(db, user_id, min_amount=50.0)
    if criteria_key == 'expense_categories_5':
        return crud.count_unique_expense_categories(db, user_id) >= 5
    return False

@app.post("/incomes", response_model=schemas.Income, tags=["Data"])
def create_income(
    income: schemas.IncomeCreate,
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    """Logs a new income entry for the current user."""
    user = crud.get_user_by_email(db, email=current_user_email)
    if not user: 
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.create_income(db=db, income=income, user_id=user.id)

@app.get("/incomes", response_model=list[schemas.Income], tags=["Data"])
def list_incomes(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    user = crud.get_user_by_email(db, current_user_email)
    if not user: raise HTTPException(status_code=404, detail="User not found")
    return crud.get_user_incomes(db, user.id, limit=100)

@app.delete("/incomes/{entry_id}", status_code=204, tags=["Data"])
def delete_income(entry_id: int, db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    user = crud.get_user_by_email(db, current_user_email)
    entry = db.query(crud.models.Income).filter_by(id=entry_id, owner_id=user.id).first()
    if not entry: raise HTTPException(status_code=404, detail="Income not found")
    db.delete(entry)
    db.commit()

# --- 4. RUN SERVER (Development Only) ---
if __name__ == "__main__":
    import uvicorn
    # This command starts the server
    uvicorn.run(app, host="0.0.0.0", port=8000)

