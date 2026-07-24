# Finity

**AI-powered fintech gamification platform — paper trading, AI financial coach, micro-courses, and behavioral gamification.**

Built for a financial inclusion hackathon. Full-stack with React frontend and FastAPI backend.

---

## Features

- **AI Financial Coach:** Personalized advice based on user profile, goals, and risk tolerance. Context-aware with conversation history.
- **Paper Trading Simulator:** Virtual ₹1,00,000 in F-Coins. Live portfolio tracking, buy/sell with real-time gain/loss analysis, asset history charts.
- **AI Micro-Learning:** Personalized curriculum with adaptive course recommendations, progress tracking, and achievement rewards.
- **Gamification:** Streak tracking, daily prompts, achievement badges (First Trade, Diamond Hands, etc.), leaderboard foundation.
- **Expense & Income Tracking:** Transaction logging with categories, visual analytics, savings rate, 90-day heatmap.
- **Smart Onboarding:** Multi-step financial profile questionnaire, risk assessment, goal setting.

## Tech Stack

- **Frontend:** React 18.3, Vite 5.4, Tailwind CSS, Framer Motion, React Router
- **Backend:** FastAPI (Python), SQLAlchemy, JWT Auth, OpenAI/Gemini AI
- **Deployment:** Vercel (frontend), Render (backend)

## Quick Start

```bash
git clone https://github.com/Muneer320/finity.git

# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
uvicorn main:app --reload
```

## Project Structure

```
finity/
├── frontend/src/
│   ├── pages/       # Dashboard, Trading, ChatBot, MicroCourse, Analytics, Expenses, Profile, Questionnaire
│   ├── components/  # Shared UI components
│   ├── context/     # React providers
│   └── utils/       # API client, achievement logic
├── backend/
│   ├── api/         # Route handlers
│   ├── db/          # Database setup + CRUD
│   └── models/      # Pydantic schemas
```

---

*Built by Muneer Alam & Amogh. Created for a financial inclusion hackathon.*