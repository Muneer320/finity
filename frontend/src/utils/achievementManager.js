// Achievement Manager - Centralized system for tracking and awarding achievements

export const ACHIEVEMENT_TYPES = {
  GETTING_STARTED: "Getting Started",
  FIRST_CHAT: "First Chat",
  FIRST_TRADE: "First Trade",
  MONEY_MANAGER: "Money Manager",
  KNOWLEDGE_SEEKER: "Knowledge Seeker",
  LEARNING_MASTER: "Learning Master",
  DIAMOND_HANDS: "Diamond Hands",
  STREAK_MASTER: "Streak Master",
  GOAL_SETTER: "Goal Setter",
  TRADING_PRO: "Trading Pro",
};

// Check if an achievement has already been earned
export const hasAchievement = (achievementName) => {
  const achievements = JSON.parse(localStorage.getItem("achievements") || "[]");
  return achievements.some((a) => a.name === achievementName);
};

// Award a new achievement
export const awardAchievement = (achievement) => {
  if (hasAchievement(achievement.name)) {
    return false; // Already has this achievement
  }

  const achievements = JSON.parse(localStorage.getItem("achievements") || "[]");
  const newAchievement = {
    ...achievement,
    date: new Date().toISOString(),
  };

  achievements.push(newAchievement);
  localStorage.setItem("achievements", JSON.stringify(achievements));

  return true; // Achievement awarded
};

// Get all achievements
export const getAchievements = () => {
  return JSON.parse(localStorage.getItem("achievements") || "[]");
};

// Check and award Diamond Hands achievement
export const checkDiamondHands = (portfolioValue) => {
  if (
    portfolioValue >= 200000 &&
    !hasAchievement(ACHIEVEMENT_TYPES.DIAMOND_HANDS)
  ) {
    return awardAchievement({
      icon: "💎",
      name: ACHIEVEMENT_TYPES.DIAMOND_HANDS,
      description: "Portfolio worth ₹2L+",
    });
  }
  return false;
};

// Check and award Trading Pro achievement
export const checkTradingPro = () => {
  const tradeCount = parseInt(localStorage.getItem("totalTrades") || "0");
  if (tradeCount >= 50 && !hasAchievement(ACHIEVEMENT_TYPES.TRADING_PRO)) {
    return awardAchievement({
      icon: "🏆",
      name: ACHIEVEMENT_TYPES.TRADING_PRO,
      description: "Made 50+ successful trades",
    });
  }
  return false;
};

// Increment trade counter
export const incrementTradeCount = () => {
  const currentCount = parseInt(localStorage.getItem("totalTrades") || "0");
  localStorage.setItem("totalTrades", (currentCount + 1).toString());
  return currentCount + 1;
};

// Check and award Streak Master achievement
export const checkStreakMaster = () => {
  const loginDates = JSON.parse(localStorage.getItem("loginDates") || "[]");

  if (loginDates.length >= 7) {
    // Check if last 7 dates are consecutive
    const sortedDates = loginDates
      .map((d) => new Date(d))
      .sort((a, b) => b - a);
    let consecutive = true;

    for (let i = 0; i < 6; i++) {
      const diff = Math.floor(
        (sortedDates[i] - sortedDates[i + 1]) / (1000 * 60 * 60 * 24)
      );
      if (diff !== 1) {
        consecutive = false;
        break;
      }
    }

    if (consecutive && !hasAchievement(ACHIEVEMENT_TYPES.STREAK_MASTER)) {
      return awardAchievement({
        icon: "🔥",
        name: ACHIEVEMENT_TYPES.STREAK_MASTER,
        description: "7 days of daily activity",
      });
    }
  }

  return false;
};

// Record today's login
export const recordLogin = () => {
  const today = new Date().toDateString();
  const loginDates = JSON.parse(localStorage.getItem("loginDates") || "[]");

  if (!loginDates.includes(today)) {
    loginDates.push(today);
    // Keep only last 10 days
    if (loginDates.length > 10) {
      loginDates.shift();
    }
    localStorage.setItem("loginDates", JSON.stringify(loginDates));
    checkStreakMaster();
  }
};

// Check Goal Setter achievement
export const checkGoalSetter = () => {
  const goals = JSON.parse(localStorage.getItem("financialGoals") || "[]");
  if (goals.length > 0 && !hasAchievement(ACHIEVEMENT_TYPES.GOAL_SETTER)) {
    return awardAchievement({
      icon: "🎯",
      name: ACHIEVEMENT_TYPES.GOAL_SETTER,
      description: "Set your first financial goal",
    });
  }
  return false;
};
