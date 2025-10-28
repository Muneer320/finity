from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    """Stores user registration, onboarding, and core profile data."""
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # --- CORE FINANCIAL DATA (Existing) ---
    fixed_budget = Column(Float, default=0.0)
    financial_confidence = Column(Integer, default=5)
    lesson_progress = Column(Integer, default=0) 
    
    # --- NEW PROFILE FIELDS (Profile Page Data) ---
    age = Column(Integer, nullable=True) # New
    occupation = Column(String, nullable=True) # New
    monthly_income = Column(Float, nullable=True) # New
    risk_tolerance = Column(String, nullable=True) # New (e.g., 'Low', 'Medium', 'High')
    monthly_expenses = Column(Float, nullable=True) 
    current_savings = Column(Float, default=0.0) 
    loan_amount = Column(Float, default=0.0) 
    current_investment = Column(Float, default=0.0) 
    experience_level = Column(String, nullable=True) 
    achievements = Column(Text, default="[]") 

    expenses = relationship("Expense", back_populates="owner")
    
    goals = relationship("Goal", back_populates="user")
    
    simulator_sessions = relationship("SimulatorSession", back_populates="user")
    
    portfolios = relationship("Portfolio", back_populates="user")

    incomes = relationship("Income", back_populates="owner")


class Expense(Base):
    __tablename__ = 'expenses'

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    note = Column(Text, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    
    owner_id = Column(Integer, ForeignKey('users.id'))
    owner = relationship("User", back_populates="expenses")


class Goal(Base):
    __tablename__ = 'goals'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False) 
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="goals")

class SimulatorSession(Base):
    __tablename__ = 'simulator_sessions'

    id = Column(Integer, primary_key=True, index=True)
    start_amount = Column(Float, nullable=False)
    monthly_contribution = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)
    
    course_summary = Column(Text, nullable=False) 
    projected_value = Column(Float, nullable=False)

    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="simulator_sessions")

class Portfolio(Base):
    """NEW MODEL: Tracks the user's paper trading assets and simulated cash."""
    __tablename__ = 'portfolios'

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False) # e.g., 'MSFT', 'GOOG'
    shares = Column(Float, nullable=False, default=0.0)
    # Average cost is critical for calculating realized and unrealized gain/loss
    average_cost = Column(Float, nullable=False, default=0.0) 

    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="portfolios")

class Income(Base):
    """NEW MODEL: Stores manually logged income events."""
    __tablename__ = 'incomes'

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    source = Column(String, nullable=False)  # e.g., Salary, Freelance, Bonus
    date = Column(DateTime, default=datetime.utcnow) # Accepts user-provided date
    
    owner_id = Column(Integer, ForeignKey('users.id'))
    owner = relationship("User", back_populates="incomes")