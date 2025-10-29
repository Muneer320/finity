import Layout from "../components/Layout";
import {
  User,
  Mail,
  Briefcase,
  DollarSign,
  Target,
  TrendingUp,
  Award,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUserProfile } from "../hooks/useUserProfile";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const { profile, loading, refreshProfile } = useUserProfile();

  useEffect(() => {
    // Use profile from backend if available, otherwise fallback to localStorage
    if (profile) {
      // Parse goals_data if it's a JSON string
      const processedProfile = { ...profile };
      if (typeof profile.goals_data === 'string') {
        try {
          processedProfile.goals_data = JSON.parse(profile.goals_data);
        } catch (e) {
          console.error('Failed to parse goals_data:', e);
        }
      }
      console.log('Profile data:', processedProfile);
      console.log('Goals data:', processedProfile.goals_data);
      setUserData(processedProfile);
      setEditedData(processedProfile);
    } else {
      const cached = JSON.parse(localStorage.getItem("userProfile") || "{}");
      setUserData(cached);
      setEditedData(cached);
    }

    const userAchievements = JSON.parse(
      localStorage.getItem("achievements") || "[]"
    );
    setAchievements(userAchievements);
  }, [profile]);

  const handleSave = async () => {
    // TODO: Save to backend API when update endpoint is available
    localStorage.setItem("userProfile", JSON.stringify(editedData));
    setUserData(editedData);
    setIsEditing(false);

    // Refresh profile from backend
    try {
      await refreshProfile();
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  if (loading && !userData) {
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

  if (!userData) return null;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const stats = [
    { label: "Age", value: userData.age, icon: User },
    { label: "Occupation", value: userData.occupation, icon: Briefcase },
    { label: "Email", value: userData.email, icon: Mail },
    {
      label: "Risk Tolerance",
      value: userData.risk_tolerance || userData.riskTolerance,
      icon: TrendingUp,
    },
  ];

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Your Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your personal and financial information
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <Edit2 className="w-5 h-5" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="card">
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label}>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {stat.label}
                      </label>
                      {isEditing && stat.label === "Age" ? (
                        <input
                          type="number"
                          value={editedData.age}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              age: e.target.value,
                            })
                          }
                          className="input-field"
                        />
                      ) : isEditing && stat.label === "Occupation" ? (
                        <select
                          value={editedData.occupation}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              occupation: e.target.value,
                            })
                          }
                          className="input-field"
                        >
                          <option value="student">Student</option>
                          <option value="employed">Employed (Full-time)</option>
                          <option value="part-time">
                            Employed (Part-time)
                          </option>
                          <option value="freelancer">Freelancer</option>
                          <option value="business">Business Owner</option>
                          <option value="unemployed">
                            Currently Unemployed
                          </option>
                          <option value="retired">Retired</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-3 p-4 bg-dark-800 rounded-lg">
                          <Icon className="w-5 h-5 text-primary-500" />
                          <span className="font-medium capitalize">
                            {stat.value}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Info */}
            <div className="card">
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6">
                Financial Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Monthly Income
                  </label>
                  <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                    <span className="font-mono font-medium text-gray-900 dark:text-white">
                      {formatCurrency(userData.monthly_income)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Monthly Expenses
                  </label>
                  <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                    <span className="font-mono font-medium text-gray-900 dark:text-white">
                      {formatCurrency(userData.monthly_expenses)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Fixed Budget (Income - Expenses)
                  </label>
                  <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                    <span className="font-mono font-medium text-gray-900 dark:text-white">
                      {formatCurrency(userData.fixed_budget)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Current Savings
                  </label>
                  <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                    <span className="font-mono font-medium text-gray-900 dark:text-white">
                      {formatCurrency(userData.current_savings)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Current Investments
                  </label>
                  <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                    <span className="font-mono font-medium text-gray-900 dark:text-white">
                      {formatCurrency(userData.current_investment)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Total Loan Amount
                  </label>
                  <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                    <span className="font-mono font-medium text-gray-900 dark:text-white">
                      {userData.loan_amount > 0
                        ? formatCurrency(userData.loan_amount)
                        : "No active loans"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Investment Experience Level
                  </label>
                  <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {userData.experience_level}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Financial Confidence (1-10)
                  </label>
                  <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-dark-700 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              (userData.financial_confidence / 10) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="font-medium text-primary-500">
                        {userData.financial_confidence}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="card">
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary-500" />
                Financial Goals
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(userData.goals_data || userData.financialGoals)?.length > 0 ? (
                  (userData.goals_data || userData.financialGoals).map(
                    (goal, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-primary-600/10 to-purple-600/10 rounded-lg border border-primary-600/20"
                      >
                        <div className="font-medium">{goal.name || goal}</div>
                        {goal.target && (
                          <div className="text-sm text-gray-400 mt-1">
                            Target: {formatCurrency(goal.target)}
                          </div>
                        )}
                      </div>
                    )
                  )
                ) : (
                  <div className="col-span-2 text-center text-gray-400 py-8">
                    No financial goals set yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="card">
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                Achievements
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg text-center">
                  <div className="text-4xl font-display font-bold text-primary-500 mb-1">
                    {achievements.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Achievements Earned
                  </div>
                </div>

                {achievements.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {achievements.slice(0, 4).map((achievement, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-100 dark:bg-dark-800 rounded-lg text-center"
                      >
                        <div className="text-3xl mb-1">{achievement.icon}</div>
                        <div className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {achievement.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {achievements.length > 4 && (
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    +{achievements.length - 4} more achievements
                  </div>
                )}
              </div>
            </div>

            {/* Learning Progress */}
            <div className="card">
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6">
                Learning Progress
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Finance Basics
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      25%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-800 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Investment Skills
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      10%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-800 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Trading Experience</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "5%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Level */}
            <div className="card">
              <h2 className="text-xl font-display font-semibold mb-4">
                Experience Level
              </h2>
              <div className="p-4 bg-gradient-to-br from-primary-600/20 to-purple-600/20 rounded-lg border border-primary-600/30 text-center">
                <div className="text-2xl font-display font-bold capitalize mb-1">
                  {userData.experience}
                </div>
                <div className="text-sm text-gray-400">Investor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
