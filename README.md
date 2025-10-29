# Finity

**A Gamified Financial Learning & Investment Platform**

An AI-powered application that democratizes financial literacy through personalized education, risk-free trading simulation, and behavioral gamification. Finity makes learning about money management and investing accessible, engaging, and practical for everyone.

---

## 🎯 Mission & Vision

**Finity** empowers financially underserved communities to build wealth and achieve financial independence by:

- 📚 **Educating** users through AI-generated, personalized micro-courses
- 💹 **Simulating** real investment scenarios without financial risk
- 🎮 **Gamifying** financial habits to drive consistent engagement
- 🤖 **Coaching** users with real-time AI-powered financial guidance

**Core Value Proposition:** Bridge the gap between financial knowledge and real-world application through interactive learning and practice.

---

## ✨ Key Features

### 🤖 AI Financial Coach (Chatbot)
- **Personalized Advice:** Context-aware responses based on user profile, goals, and risk tolerance
- **Real-time Guidance:** Instant answers to financial questions in simple language
- **Conversation History:** Maintains context across sessions for continuity
- **Achievement Integration:** Awards badges for first chat interactions

### 💹 Paper Trading Simulator
- **Virtual Currency:** Start with 100,000 F-Coins to practice investing
- **Live Market Feed:** Real-time portfolio tracking with gain/loss analysis
- **Stocks & Mutual Funds:** Trade diverse assets with simulated price movements
- **Buy/Sell Actions:** Execute trades with backend persistence
- **Asset History Charts:** View historical price data for informed decisions
- **Portfolio Analytics:** Track holdings, performance, and diversification

### 📊 Investment Simulator & AI Learning
- **Long-term Projections:** Simulate investment growth over years
- **Risk Modeling:** See returns based on different risk tolerances (Low/Medium/High)
- **AI Masterclass:** Get personalized micro-courses based on simulation results
- **Compound Interest Education:** Visual breakdown of growth mechanics
- **Beautiful Visualizations:** Gradient cards displaying key metrics

### 🎓 Micro-Learning Courses
- **Personalized Curriculum:** AI-driven course recommendations based on user activity
- **Progress Tracking:** Monitor completed lessons and learning time
- **Interactive Content:** Engaging lessons with practical examples
- **Backend Integration:** Fetch next lessons and mark completion via API
- **Achievement Rewards:** Earn badges for learning milestones

### 🎮 Gamification System
- **Streak Tracking:** Maintain daily expense logging streaks with fire emoji display
- **Daily Prompts:** Randomized check-in messages to encourage engagement
- **Achievement Badges:** Unlock rewards for milestones (First Trade, Diamond Hands, etc.)
- **Leaderboard Ready:** Foundation for competitive features
- **Behavioral Nudges:** Positive reinforcement for good financial habits

### 📈 Expense & Income Tracking
- **Transaction Logging:** Record expenses and income with categories
- **Visual Analytics:** Category breakdowns, daily trends, and monthly patterns
- **Savings Rate:** Calculate and display financial health metrics
- **Heatmap View:** 90-day activity visualization

### 👤 Smart Onboarding
- **Multi-step Questionnaire:** Collect comprehensive financial profile
- **Risk Assessment:** Determine user's investment risk tolerance
- **Goal Setting:** Define financial objectives with target amounts
- **Confidence Tracking:** Measure and improve financial literacy over time
- **Validation:** Real-time form validation with helpful error messages

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- ⚛️ React 18.3 with Vite 5.4
- 🎨 Tailwind CSS for styling
- 🌊 Framer Motion for animations
- 🧭 React Router for navigation
- 🔍 Lucide React for icons

**Backend:**
- 🚀 FastAPI (Python)
- 🗄️ SQLAlchemy ORM
- 🔐 JWT Authentication
- 🤖 AI Integration (OpenAI/Google Gemini)
- 📊 Real-time data simulation

**Deployment:**
- Frontend: Vercel (https://finityy.vercel.app)
- Backend: Render (https://finity-kb8q.onrender.com)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

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

## 📡 API Endpoints

### 🔐 Authentication
- `POST /signup` - Create new user account
- `POST /login` - User login with JWT token

### 👤 User Management
- `GET /users/me` - Get current user profile
- `POST /onboard` - Submit onboarding questionnaire data

### 💰 Transactions
- `POST /expenses` - Log new expense
- `POST /incomes` - Log new income

### 🎮 Gamification
- `GET /gamification/streak` - Get current expense logging streak
- `GET /gamification/daily-prompt` - Get randomized check-in prompt

### 💹 Trading & Market
- `GET /market/live-feed` - Get portfolio holdings with real-time values
- `POST /simulate/invest/action` - Execute buy/sell trade action
- `GET /market/asset-history/{symbol}` - Get historical price data for charting
- `POST /simulate/invest/learn` - Run investment simulation with AI insights

### 🤖 AI Features
- `POST /chat` - Send message to AI financial coach

### 🎓 Learning
- `GET /course/next-lesson` - Get next lesson for user
- `POST /course/complete-lesson` - Mark current lesson as complete

---

## 📁 Project Structure

```
finity/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout.jsx
│   │   │   └── AchievementNotification.jsx
│   │   ├── context/            # React context providers
│   │   │   ├── AchievementContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/              # Main application pages
│   │   │   ├── Dashboard.jsx   # Overview with streak tracking
│   │   │   ├── Trading.jsx     # Paper trading simulator
│   │   │   ├── ChatBot.jsx     # AI financial coach
│   │   │   ├── MicroCourse.jsx # Learning courses
│   │   │   ├── Analytics.jsx   # Expense analytics & simulator
│   │   │   ├── Expenses.jsx    # Transaction tracking
│   │   │   ├── Profile.jsx     # User profile & goals
│   │   │   ├── Questionnaire.jsx # Onboarding flow
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── utils/              # Utility functions
│   │   │   ├── api.js          # API integration layer
│   │   │   └── achievementManager.js # Gamification logic
│   │   └── App.jsx
│   ├── vite.config.js          # Vite configuration with proxy
│   └── package.json
│
└── backend/                     # FastAPI backend
    ├── main.py                 # Application entry point
    ├── requirements.txt        # Python dependencies
    ├── .env.example           # Environment template
    ├── api/                    # API route handlers
    ├── db/                     # Database layer
    │   ├── database.py        # SQLAlchemy setup
    │   └── crud.py            # Database operations
    └── models/                # Data models
        └── schemas.py         # Pydantic schemas
```

---

## 🎨 Design Philosophy

### User Experience
- **Mobile-First:** Responsive design for accessibility
- **Dark Mode:** Eye-friendly interface for extended use
- **Animations:** Smooth transitions using Framer Motion
- **Instant Feedback:** Real-time validation and success states
- **Gradients & Icons:** Visual hierarchy and modern aesthetics

### Educational Approach
- **Learning by Doing:** Practice before real investment
- **Personalization:** AI adapts to user's financial situation
- **Microlearning:** 5-minute digestible lessons
- **Positive Reinforcement:** Gamification for habit building
- **No Jargon:** Plain language explanations

---

## 🔒 Security & Best Practices

- JWT-based authentication
- Environment variable management
- CORS configuration for production
- Input validation on frontend and backend
- Error handling with user-friendly messages
- API rate limiting ready

---

## 🎯 Impact & Vision

**Current Impact:**
- ✅ Removes barriers to financial education
- ✅ Builds confidence through risk-free practice
- ✅ Encourages consistent financial habits
- ✅ Provides personalized, scalable coaching

**Future Roadmap:**
- 📱 Mobile app (React Native)
- 🌍 Multi-language support (vernacular)
- 🏆 Social features & leaderboards
- 📊 Advanced portfolio analytics
- 💳 Real broker integration (for graduates)
- 🎓 Certification programs
- 🤝 Community forums

---

## 👥 Team

**Muneer** - Full Stack Developer
- Frontend architecture & UI/UX
- Backend API integration
- Trading simulator implementation
- Deployment & DevOps

**Amogh** - Backend Developer & AI Integration
- Database design & ORM
- AI chatbot integration
- Gamification backend logic
- API endpoint development

---

## 📊 Key Metrics

- **Lines of Code:** 10,000+
- **API Endpoints:** 15+
- **Frontend Pages:** 10
- **Gamification Features:** 5+
- **AI Integrations:** 3 (Chat, Courses, Simulator)

---

## 🏆 Hackathon Success

**Problem Statement:** Financial Inclusion

**Solution:** Democratize financial literacy through gamified learning, AI coaching, and risk-free investment practice.

**Innovation:**
- AI-generated personalized micro-courses
- Real-time investment simulation with feedback
- Behavioral gamification for habit formation
- Comprehensive onboarding for personalization

---

## 📝 License

This project was created for a hackathon. All rights reserved.

---

## 🙏 Acknowledgments

Built with ❤️ for improving financial literacy and inclusion.

**Technologies Used:**
- React, Vite, Tailwind CSS, Framer Motion
- FastAPI, SQLAlchemy, JWT
- OpenAI/Google Gemini AI
- Vercel, Render

---

## 📞 Contact

For questions or collaboration:
- GitHub: [Muneer320](https://github.com/Muneer320)
- Project: [Finity Repository](https://github.com/Muneer320/finity)
- Live Demo: [https://finityy.vercel.app](https://finityy.vercel.app)

---

**Made with � for Financial Inclusion**
