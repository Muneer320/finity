# Finity

An AI-powered personal finance tracker that helps you manage expenses and get personalized financial coaching.

## 🚀 Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Configure environment variables:
- Copy `.env.example` to `.env`
- Add your API keys (OpenAI/Google Gemini)

6. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

## 📁 Project Structure

```
backend/
├── main.py                # FastAPI entry point
├── requirements.txt       # Dependencies
├── .env.example          # Environment variables template
├── .env                  # Your local environment (not tracked)
│
├── api/
│   ├── expenses.py       # Expense logging routes (Muneer)
│   └── coach.py          # AI coach routes (Amogh)
│
├── db/
│   ├── database.py       # DB connection & ORM models
│   └── crud.py           # Database operations
│
└── models/
    ├── __init__.py
    └── schemas.py        # Pydantic data schemas
```

## 🔑 API Endpoints

### Expenses
- `POST /api/expenses/log-expense` - Log a new expense
- `GET /api/expenses/user-data` - Get all user transactions

### AI Coach
- `GET /api/coach/coach-summary` - Get personalized financial insights

## 👥 Team

- **Muneer** - Expense API & Frontend Integration
- **Amogh** - Database & AI Coach Integration

## 📝 License

This is a hackathon project.
