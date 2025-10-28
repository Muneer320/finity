from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    financial_confidence = Column(Integer, default=5)

    expenses = relationship("Expense", back_populates="owner")
    
    fixed_budget = Column(Float, default=0.0) 

    goals = relationship("Goal", back_populates="user")


class Expense(Base):
    __tablename__ = 'expenses'

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    note = Column(String, nullable=True)
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