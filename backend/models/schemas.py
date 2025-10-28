# Pydantic data schemas
# Authors: Shared

from pydantic import BaseModel, Field
from datetime import date

# --- Transaction Model (Data sent by Frontend) ---


class TransactionBase(BaseModel):
    # Use float for amounts
    amount: float = Field(..., gt=0, description="The expense amount.")
    # Use a set category list
    category: str = Field(...,
                          description="E.g., Food, Transport, Rent, Fun, etc.")
    note: str | None = None

# --- Transaction Model (Data stored in DB) ---


class Transaction(TransactionBase):
    id: int
    user_id: int
    date: date

    class Config:
        # Allows conversion from DB ORM objects
        from_attributes = True

# --- AI Coach Response Model ---


class CoachSummary(BaseModel):
    # This structure is great for frontend rendering
    win: str = Field(..., description="A positive note based on user data.")
    check: str = Field(...,
                       description="A key insight or area for improvement.")
    nudge: str = Field(...,
                       description="A single, actionable task for tomorrow.")
