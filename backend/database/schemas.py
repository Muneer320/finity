# database/schemas.py

from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime, date

# --- Schemas for Authentication & Tokens (Response) ---

class TokenData(BaseModel):
    """Schema for data stored inside the JWT."""
    email: Optional[str] = None

class Token(BaseModel):
    """Schema for the returned JWT Access Token."""
    access_token: str
    token_type: str = "bearer"
    user_id: int
    user_email: EmailStr

# --- Schemas for Data Coming IN (Request Bodies) ---

class UserCreate(BaseModel):
    """Schema for user registration and login."""
    email: EmailStr
    password: str
    
class OnboardingData(BaseModel):
    """Schema for core financial data collected during onboarding."""
    fixed_budget: float # Total estimated fixed expenses
    goals_data: List[dict] # [{"name": "Emergency Fund", "target": 5000.0}]
    financial_confidence: int # 1 to 10 scale (for AI persona adjustment)
    age: int
    occupation: str
    monthly_income: float
    risk_tolerance: str
    monthly_expenses: float
    current_savings: float
    loan_amount: float
    current_investment: float
    experience_level: str

class ExpenseCreate(BaseModel):
    """Schema for logging a new expense."""
    amount: float
    category: str
    note: Optional[str] = None
    date: Optional[date] = None

class SimulatorInput(BaseModel):
    """Schema for the Investment Simulator input from the frontend."""
    start: float
    monthly: float
    years: int
    risk: str # 'Low', 'Medium', or 'High'

    
# --- Schemas for Data Going OUT (Response Bodies) ---

class Expense(ExpenseCreate):
    """Schema for returning an expense, including DB-generated fields."""
    id: int
    date: datetime
    owner_id: int
    
    class Config:
        from_attributes = True

class User(BaseModel):
    """Schema for returning complete user profile details."""
    id: int
    email: EmailStr
    
    # --- EXISTING/CORE FIELDS ---
    financial_confidence: int       # <--- FIX 1: Ensure this field exists
    fixed_budget: float
    lesson_progress: int            # <--- FIX 2: Ensure this field exists

    # --- ALL NEW PROFILE FIELDS (Must be present for return!) ---
    age: Optional[int] = None
    occupation: Optional[str] = None
    monthly_income: Optional[float] = None
    risk_tolerance: Optional[str] = None
    monthly_expenses: Optional[float] = None
    current_savings: Optional[float] = None
    loan_amount: Optional[float] = None
    current_investment: Optional[float] = None
    experience_level: Optional[str] = None
    # achievements is stored as a JSON string
    achievements: Optional[str] = None 
    
    class Config:
        from_attributes = True

class Goal(BaseModel):
    """Schema for returning a goal."""
    id: int
    name: str
    target_amount: float
    current_amount: float
    
    class Config:
        from_attributes = True
        
class SimulatorSession(BaseModel):
    """Schema for returning a saved simulator session."""
    id: Optional[int] = None
    start_amount: float
    monthly_contribution: float
    risk_level: str
    course_summary: str # AI-generated content
    projected_value: float
    
    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    message : str

class InvestmentAction(BaseModel):
    """Schema for a user's buy/sell request in the simulator."""
    asset_type: str # 'Stock', 'Mutual Fund', 'Gold'
    symbol: str # e.g., 'AAPL' or 'Gold ETF'
    action: str # 'Buy' or 'Sell'
    amount: float

class LessonContent(BaseModel):
    lesson_title: str
    lesson_content: str
    assignment_text: str  # The friendly instructions to the user
    unlock_criteria_key: str # CRITICAL: The key the frontend uses for the check (e.g., 'consecutive_logs_3')
    lesson_number: int

class IncomeCreate(BaseModel):
    """Schema for logging a new income entry."""
    amount: float
    source: str
    # Allows date input similar to ExpenseCreate
    date: Optional[date] = None 

class Income(IncomeCreate):
    """Schema for returning an income entry."""
    id: int
    date: datetime
    owner_id: int
    
    class Config:
        from_attributes = True