# Finity Frontend

React + Tailwind CSS frontend for the Finity financial learning platform.

## Features

- 🔐 **Authentication** - Login/Signup pages
- 📝 **Questionnaire** - Comprehensive user onboarding
- 💬 **AI Chatbot** - Financial coaching interface
- 📈 **Mock Trading** - Practice trading with virtual currency
- 🏆 **Gamification** - Badge system for achievements
- 👤 **Profile** - User profile and progress tracking

## Tech Stack

- **React** - UI framework
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Router** - Navigation
- **Lucide React** - Icons
- **Framer Motion** - Animations

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── Layout.jsx          # Main layout with sidebar
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Signup.jsx          # Signup page
│   ├── Questionnaire.jsx   # User onboarding
│   ├── Dashboard.jsx       # Main dashboard
│   ├── ChatBot.jsx         # AI coach chat
│   ├── Trading.jsx         # Mock trading platform
│   └── Profile.jsx         # User profile
├── App.jsx                 # Main app with routing
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Features Overview

### Login/Signup
- Clean, modern authentication UI
- Form validation
- Responsive design

### Questionnaire
- 4-step onboarding process
- Collects financial information
- Progress indicator

### Dashboard
- Overview of user's financial status
- Quick action cards
- Recent activity feed

### AI Chatbot
- Real-time chat interface
- Quick prompt suggestions
- Message history

### Mock Trading
- Virtual F-Coins (₹1,00,000 starting balance)
- 5 stocks + 2 mutual funds
- Live portfolio tracking
- Buy orders (sell coming soon)

### Gamification
- Badge system
- Achievement tracking
- Progress indicators

### Profile
- Editable user information
- Financial goals display
- Learning progress tracking
- Achievement showcase

## API Integration

The frontend is configured to proxy API requests to `http://localhost:8000`. Update `vite.config.js` to change the backend URL.

## Contributing

This is a hackathon project. Feel free to contribute!
