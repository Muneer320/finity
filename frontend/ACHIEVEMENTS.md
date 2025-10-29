# Finity Achievement System

## Overview

The Finity platform features a comprehensive achievement system that rewards users for engaging with various features. When an achievement is unlocked, users see an animated notification with confetti effects.

## Architecture

### 1. Achievement Manager (`src/utils/achievementManager.js`)

Central utility for managing all achievement logic:

- **Storage**: Uses localStorage to persist achievements
- **Tracking**: Monitors user actions (trades, logins, courses, etc.)
- **Awards**: Prevents duplicate achievements and returns achievement objects

### 2. Achievement Context (`src/context/AchievementContext.jsx`)

Global state management using React Context API:

- **Queue System**: Handles multiple simultaneous achievements
- **Display Control**: Shows one notification at a time
- **Auto-dismiss**: Automatically shows next achievement after 500ms delay

### 3. Achievement Notification (`src/components/AchievementNotification.jsx`)

Animated notification component featuring:

- **Confetti Animation**: 20 particles in 5 colors (yellow, orange, green, blue, purple)
- **Icon Animation**: Rotate and scale effects
- **Auto-dismiss**: 5-second timer with progress bar
- **Manual Close**: X button for immediate dismissal

## Achievements List

### 1. Getting Started 🎉

- **Trigger**: First visit to Dashboard
- **Description**: "Welcome to your financial journey!"
- **Logic**: `Dashboard.jsx` - Awards on component mount
- **Storage Key**: `hasVisitedDashboard`

### 2. First Chat 💬

- **Trigger**: First message sent to AI Coach
- **Description**: "Asked your first question!"
- **Logic**: `ChatBot.jsx` - Awards when first message is sent
- **Checked**: On message submit

### 3. First Trade 📈

- **Trigger**: First stock or mutual fund purchase
- **Description**: "Executed your first mock trade!"
- **Logic**: `Trading.jsx` - Awards on first buy transaction
- **Checked**: In `handleBuy()` function

### 4. Diamond Hands 💎

- **Trigger**: Portfolio value reaches ₹200,000
- **Description**: "Portfolio worth over ₹2 Lakhs!"
- **Logic**: `Trading.jsx` - Checked after every buy/sell
- **Function**: `checkDiamondHands(portfolioValue)`
- **Threshold**: ₹200,000

### 5. Trading Pro 🏆

- **Trigger**: Complete 50+ trades (buy or sell)
- **Description**: "Completed 50+ trades!"
- **Logic**: `Trading.jsx` - Increments on every trade
- **Function**: `incrementTradeCount()` + `checkTradingPro()`
- **Threshold**: 50 trades
- **Storage Key**: `totalTrades`

### 6. Money Manager 💰

- **Trigger**: First income or expense logged
- **Description**: "Logged your first transaction!"
- **Logic**: `Expenses.jsx` - Awards on first transaction
- **Checked**: In `handleSubmit()` function

### 7. Knowledge Seeker 📚

- **Trigger**: Complete first micro course
- **Description**: "Completed your first micro course!"
- **Logic**: `MicroCourse.jsx` - Awards when first course completed
- **Checked**: In `handleCompleteLesson()` when count = 1

### 8. Learning Master 🎓

- **Trigger**: Complete 3 micro courses
- **Description**: "Completed 3 micro courses!"
- **Logic**: `MicroCourse.jsx` - Awards when 3rd course completed
- **Checked**: In `handleCompleteLesson()` when count = 3

### 9. Streak Master 🔥

- **Trigger**: Login for 7 consecutive days
- **Description**: "Logged in for 7 days straight!"
- **Logic**: `achievementManager.js` - Tracks daily logins
- **Function**: `recordLogin()` + `checkStreakMaster()`
- **Storage Key**: `loginDates`
- **Implementation**: Dashboard calls `recordLogin()` on mount

### 10. Goal Setter 🎯

- **Trigger**: Set first financial goal
- **Description**: "Set your first financial goal!"
- **Logic**: `Profile.jsx` - Awards when goal is created
- **Function**: `checkGoalSetter()`
- **Storage Key**: `financialGoals`
- **Status**: Ready to implement when goal-setting UI is added

## Usage Pattern

### In Components:

```javascript
import { useAchievement } from "../context/AchievementContext";
import {
  awardAchievement,
  ACHIEVEMENT_TYPES,
} from "../utils/achievementManager";

function MyComponent() {
  const { showAchievement } = useAchievement();

  const handleAction = () => {
    // Your logic here...

    // Award achievement
    const achievement = {
      icon: "🎉",
      name: ACHIEVEMENT_TYPES.ACHIEVEMENT_NAME,
      description: "Achievement description!",
    };
    const awarded = awardAchievement(achievement);
    if (awarded) {
      showAchievement(achievement);
    }
  };
}
```

### Achievement Object Structure:

```javascript
{
  icon: "🎉",           // Emoji icon
  name: "Achievement",  // Unique name (use ACHIEVEMENT_TYPES constants)
  description: "Text",  // Description shown in notification
  date: "ISO string"    // Auto-added by awardAchievement()
}
```

## LocalStorage Keys

- **achievements**: Array of all earned achievements
- **totalTrades**: Number of trades executed (for Trading Pro)
- **loginDates**: Array of login timestamps (for Streak Master)
- **financialGoals**: Array of financial goals (for Goal Setter)
- **completedLessons**: Array of completed course IDs
- **transactions**: Income/expense transactions
- **hasVisitedDashboard**: Boolean for first visit

## Animation Details

### Confetti Particles:

- Count: 20 particles
- Colors: 5 variants (yellow, orange, green, blue, purple)
- Animation: Random horizontal drift (-100 to 100px) and vertical fall
- Duration: 2 seconds
- Easing: Linear motion

### Icon Animation:

- Rotation: [-10°, 10°, -10°, 0°]
- Scale: [1, 1.2, 1.2, 1.2, 1]
- Duration: 0.6 seconds
- Easing: Ease-in-out

### Notification:

- Position: Top-right (top-4 right-4)
- Entry: Slide from top with scale effect
- Exit: Slide to top with fade
- Auto-dismiss: 5 seconds
- Progress bar: Linear countdown

## Testing Achievements

To test all achievements:

1. **Getting Started**: Visit Dashboard
2. **First Chat**: Send a message to AI Coach
3. **First Trade**: Buy any stock or mutual fund
4. **Diamond Hands**: Buy stocks until portfolio ≥ ₹200,000
5. **Trading Pro**: Execute 50 buy/sell trades
6. **Money Manager**: Add an income or expense
7. **Knowledge Seeker**: Complete any micro course
8. **Learning Master**: Complete 3 micro courses
9. **Streak Master**: Login daily for 7 consecutive days
10. **Goal Setter**: Set a financial goal (when UI is implemented)

## Future Enhancements

Potential additions:

- Achievement tiers (Bronze, Silver, Gold)
- Achievement progress bars
- Social sharing of achievements
- Leaderboard for competitive achievements
- Seasonal/limited-time achievements
- Achievement rewards (bonus F-Coins, special features)
- Achievement categories and filters
- Achievement statistics page
