import { createContext, useContext, useState } from "react";
import AchievementNotification from "../components/AchievementNotification";

const AchievementContext = createContext();

export const useAchievement = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error("useAchievement must be used within AchievementProvider");
  }
  return context;
};

export function AchievementProvider({ children }) {
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [achievementQueue, setAchievementQueue] = useState([]);

  const showAchievement = (achievement) => {
    if (currentAchievement) {
      // If an achievement is already showing, queue this one
      setAchievementQueue((queue) => [...queue, achievement]);
    } else {
      setCurrentAchievement(achievement);
    }
  };

  const handleClose = () => {
    setCurrentAchievement(null);

    // Show next achievement from queue if any
    if (achievementQueue.length > 0) {
      setTimeout(() => {
        setCurrentAchievement(achievementQueue[0]);
        setAchievementQueue((queue) => queue.slice(1));
      }, 500);
    }
  };

  return (
    <AchievementContext.Provider value={{ showAchievement }}>
      {children}
      {currentAchievement && (
        <AchievementNotification
          achievement={currentAchievement}
          onClose={handleClose}
        />
      )}
    </AchievementContext.Provider>
  );
}
