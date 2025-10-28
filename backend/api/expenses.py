# Expense logging and retrieval routes
# Author: Muneer

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db.crud import create_transaction
from db.database import get_db, DBTransaction
from models.schemas import TransactionBase, Transaction

router = APIRouter()

# --- Dummy User ID (For Hackathon Simplicity) ---
HACKATHON_USER_ID = 1


@router.post("/log-expense", response_model=Transaction, status_code=status.HTTP_201_CREATED)
def log_expense(transaction: TransactionBase, db: Session = Depends(get_db)):
    """API to log a new expense transaction."""
    # Muneer calls Amogh's function here
    db_transaction = create_transaction(
        db=db, transaction=transaction, user_id=HACKATHON_USER_ID)
    return db_transaction


@router.get("/user-data", response_model=list[Transaction])
def get_user_data(db: Session = Depends(get_db)):
    """API to get all user transactions for summary/display."""
    # Muneer calls Amogh's function here
    transactions = db.query(DBTransaction).filter(
        DBTransaction.user_id == HACKATHON_USER_ID).all()
    return transactions
