# AI/LLM routes
# Author: Amogh

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from api.expenses import get_user_data  # Import the data function
from models.schemas import CoachSummary

router = APIRouter()


@router.get("/coach-summary", response_model=CoachSummary)
async def get_coach_summary(db: Session = Depends(get_db)):
    """API to get the personalized AI coach summary and nudge."""
    # 1. Get raw data from the expense route (uses Amogh's crud internally)
    transactions = get_user_data(db)

    # 2. Format data for the LLM prompt (e.g., convert to a simple list of dicts)
    data_for_llm = [t.model_dump() for t in transactions]

    # 3. Call the LLM (Amogh implements the LLM logic here)
    # The LLM function must return the structured CoachSummary model
    coach_response = generate_summary_from_data(data_for_llm)

    return coach_response

# Placeholder: Amogh will replace this with actual LLM integration


def generate_summary_from_data(data: list) -> CoachSummary:
    """
    STUB: Amogh will connect the Gemini/OpenAI API here.
    """
    if not data:
        return CoachSummary(
            win="Welcome! Let's start tracking expenses!",
            check="You have no data yet. Log your first item to get started.",
            nudge="Log your morning coffee right now."
        )

    # Example: Simple logic until the LLM is wired up
    total_spent = sum(item['amount'] for item in data)

    return CoachSummary(
        win=f"Great job! You've logged {len(data)} items today.",
        check=f"You've spent ${total_spent:.2f}. Watch your 'Fun' category!",
        nudge="Tomorrow, log every expense immediately after you pay."
    )
