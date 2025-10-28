# The main FastAPI entry point
# Authors: Amogh/Muneer

from fastapi import FastAPI
from api import expenses, coach
from db.database import init_db  # Import the database setup function

# Create the application instance
app = FastAPI(
    title="The Frugal Friend API",
    version="0.1.0-hackathon"
)

# 1. Initialize DB tables on startup
init_db()

# 2. Include all route files
# Muneer's routes
app.include_router(expenses.router, prefix="/api/expenses", tags=["Expenses"])
# Amogh's routes
app.include_router(coach.router, prefix="/api/coach", tags=["AI Coach"])


@app.get("/")
def read_root():
    return {"status": "running", "project": "The Frugal Friend"}

# How to run: uvicorn main:app --reload
