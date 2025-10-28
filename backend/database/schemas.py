# database/schemas.py

from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime

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

class ExpenseCreate(BaseModel):
    """Schema for logging a new expense."""
    amount: float
    category: str
    note: Optional[str] = None

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
    """Schema for returning user details (excluding sensitive data like password hash)."""
    id: int
    email: EmailStr
    financial_confidence: int
    fixed_budget: float
    
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