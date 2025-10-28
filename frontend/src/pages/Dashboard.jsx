import Layout from '../components/Layout';
import { TrendingUp, Wallet, Target, PiggyBank, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useEffect, useState } from 'react';

function Dashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    setUserData(profile);

    // Award first badge on dashboard visit
    const badges = JSON.parse(localStorage.getItem('badges') || '[]');
    if (badges.length === 0) {
      const firstBadge = {
        icon: '🎉',
        name: 'Getting Started',
        description: 'Completed your profile!',
        date: new Date().toISOString()
      };
      localStorage.setItem('badges', JSON.stringify([firstBadge]));
    }
  }, []);

  const stats = [
    {
      name: 'Portfolio Value',
      value: '₹1,00,000',
      change: '+0%',
      icon: Wallet,
      positive: true,
    },
    {
      name: 'Active Investments',
      value: '0',
      change: 'Mock Trading',
      icon: TrendingUp,
      positive: true,
    },
    {
      name: 'Learning Progress',
      value: '15%',
      change: 'Keep going!',
      icon: Target,
      positive: true,
    },
    {
      name: 'Savings Goal',
      value: '₹0',
      change: 'Set a goal',
      icon: PiggyBank,
      positive: false,
    },
  ];

  const recentActivity = [
    { type: 'badge', title: 'New Badge Earned!', description: 'Getting Started - Completed your profile', time: 'Just now', icon: '🎉' },
    { type: 'welcome', title: 'Welcome to Finity!', description: 'Start your journey by exploring the AI Coach', time: '1 min ago', icon: '👋' },
  ];

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-400">
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
                  <p className="text-gray-400 text-sm mb-1">{stat.name}</p>
                  <p className="text-2xl font-display font-bold mb-1">{stat.value}</p>
                  <p className={`text-sm ${stat.positive ? 'text-green-500' : 'text-gray-500'}`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <a href="/chat" className="card hover:border-primary-600 transition-all group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary-600/10 rounded-xl group-hover:bg-primary-600 transition-all">
                <svg className="w-8 h-8 text-primary-500 group-hover:text-white transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Ask AI Coach</h3>
                <p className="text-sm text-gray-400">Get personalized financial advice</p>
              </div>
            </div>
          </a>

          <a href="/trading" className="card hover:border-primary-600 transition-all group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-600/10 rounded-xl group-hover:bg-green-600 transition-all">
                <TrendingUp className="w-8 h-8 text-green-500 group-hover:text-white transition-all" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Start Trading</h3>
                <p className="text-sm text-gray-400">Practice with mock funds</p>
              </div>
            </div>
          </a>

          <a href="/profile" className="card hover:border-primary-600 transition-all group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-600/10 rounded-xl group-hover:bg-purple-600 transition-all">
                <Award className="w-8 h-8 text-purple-500 group-hover:text-white transition-all" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">View Progress</h3>
                <p className="text-sm text-gray-400">Track your achievements</p>
              </div>
            </div>
          </a>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-display font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-dark-800 rounded-lg">
                <div className="text-3xl">{activity.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{activity.title}</h3>
                  <p className="text-sm text-gray-400">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
