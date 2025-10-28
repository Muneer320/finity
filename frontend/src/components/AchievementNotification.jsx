import { motion, AnimatePresence } from "framer-motion";
import { Award, X } from "lucide-react";
import { useEffect, useState } from "react";

function AchievementNotification({ achievement, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed top-4 right-4 z-[100] max-w-sm overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-2xl p-6 border-2 border-primary-400 overflow-hidden">
            {/* Confetti animation overlay */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    top: "50%",
                    left: "50%",
                    opacity: 1,
                    scale: 0,
                  }}
                  animate={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: [
                      "#fbbf24",
                      "#f59e0b",
                      "#10b981",
                      "#3b82f6",
                      "#8b5cf6",
                    ][i % 5],
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              {/* Animated Icon */}
              <motion.div
                initial={{ rotate: 0, scale: 1 }}
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.2, 1.2, 1.2, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: 2,
                  repeatDelay: 0.5,
                }}
                className="text-5xl"
              >
                {achievement.icon}
              </motion.div>

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5" />
                  <h3 className="font-display font-bold text-lg">
                    Achievement Unlocked!
                  </h3>
                </div>

                <p className="font-semibold text-white/90 mb-1">
                  {achievement.name}
                </p>

                <p className="text-sm text-white/80">
                  {achievement.description}
                </p>
              </div>
            </div>

            {/* Progress bar animation */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-bl-xl"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AchievementNotification;
