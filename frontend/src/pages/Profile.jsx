import Layout from '../components/Layout';
import { User, Mail, Briefcase, DollarSign, Target, TrendingUp, Award, Edit2, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const userBadges = JSON.parse(localStorage.getItem('badges') || '[]');
    setUserData(profile);
    setEditedData(profile);
    setBadges(userBadges);
  }, []);

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(editedData));
    setUserData(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  if (!userData) return null;

  const stats = [
    { label: 'Age', value: userData.age, icon: User },
    { label: 'Occupation', value: userData.occupation, icon: Briefcase },
    { label: 'Monthly Income', value: userData.income, icon: DollarSign },
    { label: 'Risk Tolerance', value: userData.riskTolerance, icon: TrendingUp },
  ];

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Your Profile</h1>
            <p className="text-gray-400">Manage your personal and financial information</p>
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
              <h2 className="text-xl font-display font-semibold mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label}>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        {stat.label}
                      </label>
                      {isEditing && stat.label === 'Age' ? (
                        <input
                          type="number"
                          value={editedData.age}
                          onChange={(e) => setEditedData({ ...editedData, age: e.target.value })}
                          className="input-field"
                        />
                      ) : isEditing && stat.label === 'Occupation' ? (
                        <select
                          value={editedData.occupation}
                          onChange={(e) => setEditedData({ ...editedData, occupation: e.target.value })}
                          className="input-field"
                        >
                          <option value="student">Student</option>
                          <option value="employed">Employed (Full-time)</option>
                          <option value="part-time">Employed (Part-time)</option>
                          <option value="freelancer">Freelancer</option>
                          <option value="business">Business Owner</option>
                          <option value="unemployed">Currently Unemployed</option>
                          <option value="retired">Retired</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-3 p-4 bg-dark-800 rounded-lg">
                          <Icon className="w-5 h-5 text-primary-500" />
                          <span className="font-medium capitalize">{stat.value}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Info */}
            <div className="card">
              <h2 className="text-xl font-display font-semibold mb-6">Financial Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Monthly Expenses
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedData.monthlyExpenses}
                      onChange={(e) => setEditedData({ ...editedData, monthlyExpenses: e.target.value })}
                      className="input-field"
                    />
                  ) : (
                    <div className="p-4 bg-dark-800 rounded-lg">
                      <span className="font-mono font-medium">₹{userData.monthlyExpenses}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Current Savings
                  </label>
                  <div className="p-4 bg-dark-800 rounded-lg">
                    <span className="font-medium capitalize">{userData.savings}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Loans
                  </label>
                  <div className="p-4 bg-dark-800 rounded-lg">
                    <span className="font-medium capitalize">
                      {userData.loans === 'yes' ? `Yes - ₹${userData.loanAmount}` : 'No active loans'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Current Investments
                  </label>
                  <div className="p-4 bg-dark-800 rounded-lg">
                    <span className="font-medium capitalize">{userData.investments}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="card">
              <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary-500" />
                Financial Goals
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userData.financialGoals?.map((goal, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-primary-600/10 to-purple-600/10 rounded-lg border border-primary-600/20"
                  >
                    <span className="font-medium">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="card">
              <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                Achievements
              </h2>
              
              <div className="space-y-3">
                <div className="p-4 bg-dark-800 rounded-lg text-center">
                  <div className="text-4xl font-display font-bold text-primary-500 mb-1">
                    {badges.length}
                  </div>
                  <div className="text-sm text-gray-400">Badges Earned</div>
                </div>

                {badges.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {badges.slice(0, 4).map((badge, index) => (
                      <div key={index} className="p-3 bg-dark-800 rounded-lg text-center">
                        <div className="text-3xl mb-1">{badge.icon}</div>
                        <div className="text-xs font-medium truncate">{badge.name}</div>
                      </div>
                    ))}
                  </div>
                )}

                {badges.length > 4 && (
                  <div className="text-center text-sm text-gray-400">
                    +{badges.length - 4} more badges
                  </div>
                )}
              </div>
            </div>

            {/* Learning Progress */}
            <div className="card">
              <h2 className="text-xl font-display font-semibold mb-6">Learning Progress</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Finance Basics</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Investment Skills</span>
                    <span className="font-medium">10%</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Trading Experience</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Level */}
            <div className="card">
              <h2 className="text-xl font-display font-semibold mb-4">Experience Level</h2>
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
