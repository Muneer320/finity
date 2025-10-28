# 💰 Finity

**A Risk-Free Financial Learning Platform**

An AI-powered application that provides a comprehensive environment for users to learn personal finance and investment through two core features: an intelligent chatbot for financial advice and a mock trading platform for risk-free investment practice.

---

## 🎯 Core Identity & Goal

- **Project Name:** Finity
- **Duration:** 11-Hour Hackathon MVP
- **Core Value Proposition:** Provide a risk-free, interactive environment for users to learn personal finance (via the chatbot) and investment (via mock trading). The entire experience is driven by an AI that learns from the user's behavior and financial goals.

---

## 🧠 The Finity Mentor (AI Persona)

| Attribute        | Detail                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Persona Name** | The Finity Mentor                                                                                                            |
| **Tone & Style** | Expert, but approachable. Analytical, but encouraging. Focused on explaining _why_ a suggestion is made.                     |
| **Goal**         | Drive learning and engagement across two distinct pillars: **Personal Finance** (Chatbot) and **Investment** (Mock Trading). |

---

## ✨ MVP Features

### Feature I: The Finity Chatbot (Personal Finance Coach)

**Purpose:** Answer user questions, provide basic financial tips, and give advice based on their stored context.

| Aspect              | MVP Implementation                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| **User Context**    | Captures initial user data (Age, Monthly Income, Primary Goal, etc.) and maintains conversation history |
| **Core Function**   | Contextual financial advice based on user profile and chat history                                      |
| **Integration**     | Conversation history included in LLM prompt for continuity                                              |
| **Key Data Points** | Age, Monthly Income Range, Primary Financial Goal, Risk Tolerance, Current Savings                      |

### Feature II: Mock Trading Model (Investment Coach)

**Purpose:** Allow users to practice investment decisions with virtual currency and receive AI-powered feedback.

| Aspect                 | MVP Implementation                                                                                   |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| **Mock Currency**      | Users start with **1,00,000 F-Coins**                                                                |
| **Market Data**        | 5 dummy stocks + 2 dummy mutual funds with simulated price movements                                 |
| **Price Simulation**   | `Price = Initial Price ± (Random × 5%)` on each API call                                             |
| **Core Function**      | Execute mock BUY orders (deduct F-Coins, add stock to holdings)                                      |
| **AI Integration**     | AI Mentor analyzes latest trade and provides specific feedback on risk, diversification, or strategy |
| **Portfolio Tracking** | User Portfolio (holdings), Trade History, Cash Balance                                               |

---

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

---

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

---

## 🔑 API Endpoints (Planned)

### Personal Finance Chatbot

- `POST /api/chat/send-message` - Send message to AI financial coach
- `GET /api/chat/history` - Get conversation history
- `POST /api/user/profile` - Set/update user financial context

### Mock Trading

- `GET /api/trading/market-data` - Get current mock market prices
- `POST /api/trading/buy` - Execute mock BUY order
- `GET /api/trading/portfolio` - Get user's current portfolio
- `GET /api/trading/history` - Get trade history
- `GET /api/trading/feedback` - Get AI analysis of latest trade

### Current Endpoints (Expense Tracker - Foundation)

- `POST /api/expenses/log-expense` - Log a new expense
- `GET /api/expenses/user-data` - Get all user transactions
- `GET /api/coach/coach-summary` - Get personalized financial insights

---

## 🎓 AI Mentor Prompt Structure

The Finity Mentor serves as two distinct advisors:

1. **Personal Finance Coach:** Provides actionable advice based on the user's financial goals and context
2. **Investment Mentor:** Analyzes the user's latest mock trade and gives specific tips on risk, diversification, or strategy

**System Prompt:**

> "Finity is a financial and investment education app. I will send you a user's **financial context** and their **mock trading portfolio/history**. Your response must serve as two distinct mentors:
>
> 1. **Personal Finance Coach:** Provide actionable advice based on the user's goal.
> 2. **Investment Mentor:** Analyze the user's latest mock trade and give a single, specific tip on risk, diversification, or strategy."

---

## ⚠️ Technical Implementation & Risk Mitigation

| Component                   | Risk & Mitigation                                                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **LLM Memory/Context**      | **Risk:** Losing conversation context<br>**Mitigation:** Store last 5 user/AI turns in application state and include in LLM prompt |
| **Mock Market Data**        | **Risk:** Complex external API integration<br>**Mitigation:** Hardcode asset list with simple price randomization script           |
| **11-Hour Time Constraint** | **Risk:** Feature creep<br>**Mitigation:** Focus on BUY orders only, no SELL logic in MVP                                          |

---

## 👥 Team & Responsibilities

- **Muneer:** Backend routes for Chatbot API, Mock Trading API, and Frontend Integration
- **Amogh:** Database logic for Chatbot context, Mock Portfolio, and AI Coach Integration

---

## 📝 Development Notes

This is an **11-hour hackathon MVP**. The focus is on:

- ✅ Demonstrating core functionality
- ✅ Clean separation of concerns
- ✅ AI-driven learning experiences
- ❌ NOT on production-ready features like authentication, sell orders, or real market data

---

## 📝 License

This is a hackathon project.
