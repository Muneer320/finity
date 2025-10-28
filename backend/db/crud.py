# Create, Read, Update, Delete functions
# Author: Amogh

from sqlalchemy.orm import Session
from db.database import DBTransaction
from models.schemas import TransactionBase, Transaction
from datetime import date

# --- WRITE/CREATE ---


def create_transaction(db: Session, transaction: TransactionBase, user_id: int):
    # Create the DB object
    db_transaction = DBTransaction(
        **transaction.model_dump(),
        user_id=user_id,
        date=date.today()
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# --- READ/RETRIEVE ---


def get_transactions_by_user(db: Session, user_id: int):
    # Get all transactions for a simple summary
    return db.query(DBTransaction).filter(DBTransaction.user_id == user_id).all()
