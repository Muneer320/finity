import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  User,
  LogOut,
  Award,
  DollarSign,
  BarChart3,
  Lock,
  Sun,
  Moon,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showAchievements, setShowAchievements] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Coach", href: "/chat", icon: MessageSquare },
    { name: "FinityArena", href: "/trading", icon: TrendingUp },
    { name: "Micro Courses", href: "/courses", icon: BookOpen },
    { name: "Expenses", href: "/expenses", icon: DollarSign },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("questionnaireCompleted");
    navigate("/login");
  };

  const achievements = JSON.parse(localStorage.getItem("achievements") || "[]");

  // All possible achievements in the app
  const allPossibleAchievements = [
    {
      icon: "🎉",
      name: "Getting Started",
      description: "Completed your profile!",
      requirement: "Complete the initial questionnaire",
    },
    {
      icon: "💬",
      name: "First Chat",
      description: "Asked your first question!",
      requirement: "Send a message to the AI Coach",
    },
    {
      icon: "📈",
      name: "First Trade",
      description: "Made your first trade!",
      requirement: "Buy a stock or mutual fund",
    },
    {
      icon: "💰",
      name: "Money Manager",
      description: "Logged your first transaction!",
      requirement: "Add an expense or income entry",
    },
    {
      icon: "📚",
      name: "Knowledge Seeker",
      description: "Completed your first lesson!",
      requirement: "Finish any micro course lesson",
    },
    {
      icon: "🎓",
      name: "Learning Master",
      description: "Completed 3 courses!",
      requirement: "Complete 3 micro courses",
    },
    {
      icon: "💎",
      name: "Diamond Hands",
      description: "Portfolio worth ₹2L+",
      requirement: "Grow your trading portfolio to ₹200,000",
    },
    {
      icon: "🔥",
      name: "Streak Master",
      description: "7 days of daily activity",
      requirement: "Use Finity for 7 consecutive days",
    },
    {
      icon: "🎯",
      name: "Goal Setter",
      description: "Set your first financial goal",
      requirement: "Define a savings or investment goal",
    },
    {
      icon: "🏆",
      name: "Trading Pro",
      description: "Made 50+ successful trades",
      requirement: "Complete 50 buy/sell transactions",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Mobile Warning */}
      <div className="lg:hidden fixed inset-0 bg-dark-950 flex items-center justify-center p-8 z-50">
        <div className="text-center">
          <img
            src="/finityLogo.png"
            alt="Finity"
            className="w-32 h-32 mx-auto mb-4"
          />
          <p className="text-gray-400 mb-4">
            Please view this application from a larger screen for the best
            experience.
          </p>
          <p className="text-sm text-gray-500">Minimum screen width: 1024px</p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-800">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-dark-800">
            <div className="flex items-center gap-2">
              <img
                src="/finityLogoText.png"
                alt="Finity"
                className="h-15 w-auto"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Achievements Button */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-800">
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white transition-all"
            >
              <Award className="w-5 h-5" />
              <span className="font-medium">Achievements</span>
              {achievements.length > 0 && (
                <span className="ml-auto bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  {achievements.length}
                </span>
              )}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-red-600 dark:hover:text-red-400 transition-all mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="hidden lg:block lg:ml-64">
        {/* Theme Toggle Button - Top Right */}
        <div className="fixed top-4 right-4 z-40">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-all shadow-lg"
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {children}
      </div>

      {/* Achievements Modal */}
      {showAchievements && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAchievements(false)}
        >
          <div
            className="bg-white dark:bg-dark-900 rounded-xl p-8 max-w-4xl w-full mx-4 border border-gray-200 dark:border-dark-800 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                Your Achievements
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {achievements.length} / {allPossibleAchievements.length}{" "}
                Unlocked
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allPossibleAchievements.map((achievement, index) => {
                const isUnlocked = achievements.some(
                  (a) => a.name === achievement.name
                );
                return (
                  <div
                    key={index}
                    className={`card text-center p-4 relative ${
                      !isUnlocked ? "opacity-50" : ""
                    }`}
                  >
                    {!isUnlocked && (
                      <div className="absolute top-2 right-2">
                        <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <div className="font-medium text-sm text-gray-900 dark:text-white">
                      {achievement.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {achievement.description}
                    </div>
                    {!isUnlocked && achievement.requirement && (
                      <div className="text-xs text-primary-500 mt-2">
                        🎯 {achievement.requirement}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowAchievements(false)}
              className="btn-secondary w-full mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
