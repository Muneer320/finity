import Layout from "../components/Layout";
import {
  TrendingUp,
  Wallet,
  Target,
  PiggyBank,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAchievement } from "../context/AchievementContext";
import {
  awardAchievement,
  ACHIEVEMENT_TYPES,
  recordLogin,
} from "../utils/achievementManager";
import { useUserProfile } from "../hooks/useUserProfile";
import { gamificationAPI } from "../utils/api";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [streak, setStreak] = useState(0);
  const [streakLoading, setStreakLoading] = useState(true);
  const { showAchievement } = useAchievement();
  const { profile, loading: profileLoading, refreshProfile } = useUserProfile();

  useEffect(() => {
    // Use profile from backend if available, otherwise fallback to localStorage
    if (profile) {
      setUserData(profile);
    } else {
      const cached = JSON.parse(localStorage.getItem("userProfile") || "{}");
      setUserData(cached);
    }

    // Fetch user's streak
    const fetchStreak = async () => {
      try {
        const response = await gamificationAPI.getStreak();
        setStreak(response.streak || 0);
      } catch (err) {
        console.error("Failed to fetch streak:", err);
        setStreak(0);
      } finally {
        setStreakLoading(false);
      }
    };

    fetchStreak();

    // Record login for streak tracking
    recordLogin();

    // Award first achievement on dashboard visit
    const achievements = JSON.parse(
      localStorage.getItem("achievements") || "[]"
    );
    if (achievements.length === 0) {
      const firstAchievement = {
        icon: "🎉",
        name: ACHIEVEMENT_TYPES.GETTING_STARTED,
        description: "Completed your profile!",
      };
      const awarded = awardAchievement(firstAchievement);
      if (awarded) {
        showAchievement(firstAchievement);
      }
    }
  }, [showAchievement, profile]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const stats = [
    {
      name: "Monthly Income",
      value: formatCurrency(userData?.monthly_income),
      change: `Budget: ${formatCurrency(userData?.fixed_budget)}`,
      icon: Wallet,
      positive: true,
    },
    {
      name: "Current Investments",
      value: formatCurrency(userData?.current_investment),
      change: `${userData?.experience_level || "Beginner"} Level`,
      icon: TrendingUp,
      positive: true,
    },
    {
      name: "Learning Progress",
      value: `${userData?.lesson_progress || 0}%`,
      change: "Keep going!",
      icon: Target,
      positive: true,
    },
    {
      name: "Current Savings",
      value: formatCurrency(userData?.current_savings),
      change:
        userData?.loan_amount > 0
          ? `Loan: ${formatCurrency(userData.loan_amount)}`
          : "No loans",
      icon: PiggyBank,
      positive: userData?.loan_amount === 0,
    },
  ];

  const recentActivity = [
    {
      type: "achievement",
      title: "New Achievement Earned!",
      description: "Getting Started - Completed your profile",
      time: "Just now",
      icon: "🎉",
    },
    {
      type: "welcome",
      title: "Welcome to Finity!",
      description: "Start your journey by exploring the AI Coach",
      time: "1 min ago",
      icon: "👋",
    },
  ];

  if (profileLoading && !userData) {
    return (
      <Layout>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Welcome back
            {userData?.email ? `, ${userData.email.split("@")[0]}` : ""}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's an overview of your financial journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary-600/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  {stat.positive ? (
                    <ArrowUpRight className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm ${
                      stat.positive
                        ? "text-green-500"
                        : "text-gray-600 dark:text-gray-500"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Streak Card */}
        <div className="mb-8">
          <div className="card bg-gradient-to-br from-orange-500/10 via-red-500/10 to-yellow-500/10 border-2 border-orange-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-orange-500/20 rounded-xl">
                  <Flame className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-1">
                    Expense Logging Streak
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Keep logging daily to maintain your streak! 🔥
                  </p>
                </div>
              </div>
              <div className="text-center">
                {streakLoading ? (
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <div className="text-5xl font-display font-bold text-orange-500">
                      {streak}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {streak === 1 ? "day" : "days"}
                    </div>
                  </>
                )}
              </div>
            </div>
            {streak >= 3 && (
              <div className="mt-4 pt-4 border-t border-orange-500/20">
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                  🎉 Amazing! You're on fire! Keep it up!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <a
            href="/chat"
            className="card hover:border-primary-600 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary-600/10 rounded-xl group-hover:bg-primary-600 transition-all">
                <svg
                  className="w-8 h-8 text-primary-500 group-hover:text-white transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Ask AI Coach
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get personalized financial advice
                </p>
              </div>
            </div>
          </a>

          <a
            href="/trading"
            className="card hover:border-primary-600 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-600/10 rounded-xl group-hover:bg-green-600 transition-all">
                <TrendingUp className="w-8 h-8 text-green-500 group-hover:text-white transition-all" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Start Trading
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Practice with mock funds
                </p>
              </div>
            </div>
          </a>

          <a
            href="/profile"
            className="card hover:border-primary-600 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-600/10 rounded-xl group-hover:bg-purple-600 transition-all">
                <Award className="w-8 h-8 text-purple-500 group-hover:text-white transition-all" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  View Progress
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track your achievements
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-100 dark:bg-dark-800 rounded-lg"
              >
                <div className="text-3xl">{activity.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
