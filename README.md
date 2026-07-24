# Finity

**AI-powered fintech gamification platform — paper trading, financial coach, micro-courses, and expense tracking.**

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-0.95-009688?style=for-the-badge&logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Framer%20Motion-enabled-black?style=for-the-badge&logo=framer" alt="Framer Motion">
  <img src="https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?style=for-the-badge&logo=python" alt="SQLAlchemy">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="MIT">
</p>

---

## What It Does

Finity makes financial literacy accessible by combining four modes of learning: a paper trading simulator where users practice with virtual currency, an AI financial coach that gives personalized advice, micro-courses that adapt to the user's knowledge level, and expense tracking with visual analytics. Built for a financial inclusion hackathon.

---

## Features

### 💹 Paper Trading Simulator

| Feature | Detail |
|---------|--------|
| Virtual portfolio | Start with ₹1,00,000 in F-Coins |
| Assets | Stocks & mutual funds with simulated price movements |
| Trading | Buy/sell with backend-persisted portfolio |
| Analytics | Real-time gain/loss, asset history charts, diversification view |

### 🤖 AI Financial Coach

| Feature | Detail |
|---------|--------|
| Personalization | Context-aware responses based on profile, goals, risk tolerance |
| History | Maintains conversation context across sessions |
| Integration | Achievement badges for first interactions |

### 🎓 Micro-Learning Courses

| Feature | Detail |
|---------|--------|
| Adaptive curriculum | AI-driven course recommendations based on user activity |
| Tracking | Progress per lesson, total learning time |
| Gamification | Badges for learning milestones |

### 🎮 Gamification

| Feature | Detail |
|---------|--------|
| Streaks | Daily logging streaks with fire emoji display |
| Badges | First Trade, Diamond Hands, learning milestones |
| Daily prompts | Randomized check-in messages for engagement |

### 📊 Expense & Income Tracking

| Feature | Detail |
|---------|--------|
| Logging | Categorized transactions with amounts |
| Analytics | Category breakdowns, daily trends, monthly patterns, 90-day heatmap |
| Metrics | Savings rate and financial health indicators |

---

## Architecture

```
finity/
├── frontend/                    # React 18.3 + Vite 5.4
│   ├── src/
│   │   ├── pages/               # 10 pages (Dashboard, Trading, ChatBot, MicroCourse, 
│   │   │                        # Analytics, Expenses, Profile, Questionnaire, Login, Signup)
│   │   ├── components/          # Shared UI (Layout, AchievementNotification, etc.)
│   │   ├── context/             # AchievementContext, ThemeContext
│   │   └── utils/               # API client, achievementManager
│   └── vite.config.js           # API proxy config
│
├── backend/                     # FastAPI + SQLAlchemy
│   ├── api/                     # Route handlers
│   ├── db/                      # database.py, crud.py
│   ├── models/                  # Pydantic schemas
│   └── main.py                  # App entry point
│
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18.3, Vite 5.4, Tailwind CSS, Framer Motion, React Router, Lucide React |
| **Backend** | FastAPI, SQLAlchemy 2.0, JWT Auth, Pydantic |
| **AI** | OpenAI / Google Gemini integration for coach + course generation |
| **Database** | PostgreSQL via SQLAlchemy |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## API Endpoints

| Module | Endpoints | Purpose |
|--------|-----------|---------|
| Auth | 2 | Signup, login |
| User | 2 | Profile, onboarding |
| Transactions | 2 | Log expense, log income |
| Gamification | 2 | Streak check, daily prompt |
| Trading | 5 | Live feed, buy/sell, asset history, simulate, learn |
| AI | 1 | Chat with financial coach |
| Learning | 2 | Get next lesson, complete lesson |

---

## Quick Start

```bash
git clone https://github.com/Muneer320/finity.git

# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend docs at `http://localhost:8000/docs`.

---

## License

MIT © Muneer Alam & Amogh