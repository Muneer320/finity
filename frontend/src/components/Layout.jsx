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
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showBadges, setShowBadges] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Coach", href: "/chat", icon: MessageSquare },
    { name: "Mock Trading", href: "/trading", icon: TrendingUp },
    { name: "Expenses", href: "/expenses", icon: DollarSign },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("questionnaireCompleted");
    navigate("/login");
  };

  const badges = JSON.parse(localStorage.getItem("badges") || "[]");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Mobile Warning */}
      <div className="lg:hidden fixed inset-0 bg-dark-950 flex items-center justify-center p-8 z-50">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-primary-500" />
          <h1 className="text-2xl font-display font-bold mb-2">Finity</h1>
          <p className="text-gray-400 mb-4">
            Please view this application from a larger screen for the best experience.
          </p>
          <p className="text-sm text-gray-500">
            Minimum screen width: 1024px
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-800">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-dark-800">
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Finity
            </h1>
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

          {/* Badges Button */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-800">
            <button
              onClick={() => setShowBadges(!showBadges)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white transition-all"
            >
              <Award className="w-5 h-5" />
              <span className="font-medium">Badges</span>
              {badges.length > 0 && (
                <span className="ml-auto bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  {badges.length}
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
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
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

      {/* Badges Modal */}
      {showBadges && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowBadges(false)}
        >
          <div
            className="bg-white dark:bg-dark-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-4">Your Badges</h3>

            {badges.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No badges yet. Complete tasks to earn badges!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div key={index} className="card text-center p-4">
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <div className="font-medium text-sm text-gray-900 dark:text-white">{badge.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {badge.description}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowBadges(false)}
              className="btn-secondary w-full mt-4"
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
