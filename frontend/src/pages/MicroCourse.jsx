import Layout from "../components/Layout";
import {
  BookOpen,
  TrendingUp,
  Lock,
  CheckCircle,
  Clock,
  Award,
} from "lucide-react";
import { useState, useEffect } from "react";

function MicroCourse() {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Get trading history to personalize courses
  const portfolio = JSON.parse(localStorage.getItem("portfolio") || "[]");
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

  // Determine user's trading behavior
  const hasStockTrades = portfolio.some(
    (item) => item.category !== "Mutual Fund"
  );
  const hasMutualFunds = portfolio.some(
    (item) => item.category === "Mutual Fund"
  );
  const isActive = portfolio.length > 0;

  // Personalized course recommendations
  const courses = [
    {
      id: 1,
      title: "Introduction to Stock Markets",
      description:
        "Learn the basics of how stock markets work and why they matter",
      duration: "5 min",
      difficulty: "Beginner",
      unlocked: true,
      completed: completedLessons.includes(1),
      icon: "📚",
      lessons: [
        "What is a Stock?",
        "How Stock Markets Work",
        "Understanding Stock Prices",
        "Market Hours and Trading",
      ],
      content: `
        <h3>What is a Stock?</h3>
        <p>A stock represents ownership in a company. When you buy a stock, you become a shareholder and own a small piece of that company.</p>
        
        <h3>How Stock Markets Work</h3>
        <p>Stock markets are platforms where buyers and sellers trade stocks. Prices fluctuate based on supply and demand, company performance, and market conditions.</p>
        
        <h3>Key Concepts:</h3>
        <ul>
          <li><strong>Market Cap:</strong> Total value of a company's shares</li>
          <li><strong>Volume:</strong> Number of shares traded</li>
          <li><strong>Bull Market:</strong> Rising market prices</li>
          <li><strong>Bear Market:</strong> Falling market prices</li>
        </ul>
      `,
    },
    {
      id: 2,
      title: "Reading Stock Trends",
      description: "Understand charts, patterns, and technical indicators",
      duration: "7 min",
      difficulty: "Intermediate",
      unlocked: hasStockTrades,
      completed: completedLessons.includes(2),
      icon: "📈",
      recommended: hasStockTrades,
      lessons: [
        "Understanding Candlestick Charts",
        "Support and Resistance Levels",
        "Moving Averages",
        "Volume Analysis",
      ],
      content: `
        <h3>Reading Stock Charts</h3>
        <p>Charts help visualize price movements over time. The most common type is the candlestick chart.</p>
        
        <h3>Key Indicators:</h3>
        <ul>
          <li><strong>Support Level:</strong> Price floor where buying interest emerges</li>
          <li><strong>Resistance Level:</strong> Price ceiling where selling pressure increases</li>
          <li><strong>Moving Average:</strong> Average price over a period to smooth trends</li>
          <li><strong>Volume:</strong> Confirms the strength of price movements</li>
        </ul>
        
        <h3>Pro Tip:</h3>
        <p>Never rely on a single indicator. Use multiple signals to confirm your trading decisions.</p>
      `,
    },
    {
      id: 3,
      title: "Mutual Funds Explained",
      description: "Diversification, NAV, and choosing the right funds",
      duration: "6 min",
      difficulty: "Beginner",
      unlocked: true,
      completed: completedLessons.includes(3),
      icon: "💼",
      recommended: hasMutualFunds,
      lessons: [
        "What are Mutual Funds?",
        "Types of Mutual Funds",
        "Understanding NAV",
        "Expense Ratios",
      ],
      content: `
        <h3>Mutual Funds Basics</h3>
        <p>A mutual fund pools money from many investors to invest in stocks, bonds, or other securities. It's managed by professional fund managers.</p>
        
        <h3>Types of Mutual Funds:</h3>
        <ul>
          <li><strong>Equity Funds:</strong> Invest primarily in stocks</li>
          <li><strong>Debt Funds:</strong> Invest in bonds and fixed-income securities</li>
          <li><strong>Balanced Funds:</strong> Mix of stocks and bonds</li>
          <li><strong>Index Funds:</strong> Track market indices like Nifty 50</li>
        </ul>
        
        <h3>Key Metrics:</h3>
        <p><strong>NAV (Net Asset Value):</strong> Price per unit of the fund</p>
        <p><strong>Expense Ratio:</strong> Annual fees charged by the fund</p>
      `,
    },
    {
      id: 4,
      title: "Risk Management Strategies",
      description: "Protect your portfolio with proven techniques",
      duration: "8 min",
      difficulty: "Intermediate",
      unlocked: isActive,
      completed: completedLessons.includes(4),
      icon: "🛡️",
      recommended: isActive,
      lessons: [
        "Understanding Risk vs. Reward",
        "Portfolio Diversification",
        "Stop-Loss Orders",
        "Position Sizing",
      ],
      content: `
        <h3>Risk Management Fundamentals</h3>
        <p>Successful trading isn't just about making profits—it's about protecting your capital and managing losses.</p>
        
        <h3>Key Strategies:</h3>
        <ul>
          <li><strong>Diversification:</strong> Don't put all eggs in one basket</li>
          <li><strong>Stop-Loss:</strong> Automatic sell order at predetermined price</li>
          <li><strong>Position Sizing:</strong> Invest only a small % of capital per trade</li>
          <li><strong>Risk-Reward Ratio:</strong> Aim for at least 1:2 or 1:3</li>
        </ul>
        
        <h3>Golden Rule:</h3>
        <p>Never risk more than 1-2% of your total portfolio on a single trade.</p>
      `,
    },
    {
      id: 5,
      title: "Understanding Market Orders",
      description: "Market orders, limit orders, and execution strategies",
      duration: "5 min",
      difficulty: "Beginner",
      unlocked: true,
      completed: completedLessons.includes(5),
      icon: "⚡",
      lessons: [
        "Market Orders",
        "Limit Orders",
        "Stop-Loss Orders",
        "When to Use Each",
      ],
      content: `
        <h3>Types of Orders</h3>
        
        <h4>1. Market Order</h4>
        <p>Buys or sells immediately at current market price. Fast execution but price may vary.</p>
        
        <h4>2. Limit Order</h4>
        <p>Buys or sells only at specified price or better. More control but may not execute.</p>
        
        <h4>3. Stop-Loss Order</h4>
        <p>Automatically sells when price drops to specified level to limit losses.</p>
        
        <h3>When to Use:</h3>
        <ul>
          <li><strong>Market Order:</strong> When you want immediate execution</li>
          <li><strong>Limit Order:</strong> When you want a specific price</li>
          <li><strong>Stop-Loss:</strong> To protect against large losses</li>
        </ul>
      `,
    },
    {
      id: 6,
      title: "Advanced Portfolio Strategies",
      description: "Asset allocation, rebalancing, and long-term planning",
      duration: "10 min",
      difficulty: "Advanced",
      unlocked: completedLessons.length >= 3,
      completed: completedLessons.includes(6),
      icon: "🎯",
      lessons: [
        "Asset Allocation",
        "Portfolio Rebalancing",
        "Tax-Efficient Investing",
        "Long-Term Wealth Building",
      ],
      content: `
        <h3>Building a Strong Portfolio</h3>
        <p>A well-balanced portfolio adapts to your age, goals, and risk tolerance.</p>
        
        <h3>Asset Allocation Strategy:</h3>
        <ul>
          <li><strong>Age-Based:</strong> 100 - your age = % in stocks</li>
          <li><strong>Goal-Based:</strong> Align with financial goals (retirement, home, etc.)</li>
          <li><strong>Risk-Based:</strong> Conservative, moderate, or aggressive</li>
        </ul>
        
        <h3>Rebalancing:</h3>
        <p>Review and adjust your portfolio quarterly or annually to maintain desired allocation.</p>
        
        <h3>Tax Efficiency:</h3>
        <ul>
          <li>Use tax-advantaged accounts (PPF, ELSS)</li>
          <li>Hold investments for long-term gains</li>
          <li>Harvest tax losses when appropriate</li>
        </ul>
      `,
    },
  ];

  const handleCompleteLesson = (courseId) => {
    if (!completedLessons.includes(courseId)) {
      const updated = [...completedLessons, courseId];
      setCompletedLessons(updated);
      localStorage.setItem("completedLessons", JSON.stringify(updated));

      // Award badge for completing first course
      const badges = JSON.parse(localStorage.getItem("badges") || "[]");
      if (
        updated.length === 1 &&
        !badges.some((b) => b.name === "Knowledge Seeker")
      ) {
        badges.push({
          icon: "📚",
          name: "Knowledge Seeker",
          description: "Completed your first micro course!",
          date: new Date().toISOString(),
        });
        localStorage.setItem("badges", JSON.stringify(badges));
      }

      // Award badge for completing 3 courses
      if (
        updated.length === 3 &&
        !badges.some((b) => b.name === "Learning Master")
      ) {
        badges.push({
          icon: "🎓",
          name: "Learning Master",
          description: "Completed 3 micro courses!",
          date: new Date().toISOString(),
        });
        localStorage.setItem("badges", JSON.stringify(badges));
      }
    }
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("completedLessons") || "[]");
    setCompletedLessons(saved);
  }, []);

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2 text-gray-900 dark:text-white">
            Micro Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Personalized learning based on your trading activity
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-primary-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Courses Completed
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              {completedLessons.length} / {courses.length}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Total Learning Time
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              {completedLessons.reduce((sum, id) => {
                const course = courses.find((c) => c.id === id);
                return sum + parseInt(course?.duration || "0");
              }, 0)}{" "}
              min
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Badges Earned
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              {completedLessons.length >= 3
                ? 2
                : completedLessons.length >= 1
                ? 1
                : 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course List */}
          <div className="lg:col-span-2 space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`card cursor-pointer transition-all ${
                  !course.unlocked ? "opacity-50" : "hover:shadow-xl"
                } ${
                  selectedLesson?.id === course.id
                    ? "ring-2 ring-primary-600"
                    : ""
                }`}
                onClick={() => course.unlocked && setSelectedLesson(course)}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{course.icon}</div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-1">
                          {course.title}
                          {course.recommended && (
                            <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-600/20 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full">
                              Recommended
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {course.description}
                        </p>
                      </div>

                      {course.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      ) : !course.unlocked ? (
                        <Lock className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      ) : null}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </span>
                      <span
                        className={`badge ${
                          course.difficulty === "Beginner"
                            ? "bg-green-100 dark:bg-green-600/20 text-green-600 dark:text-green-400"
                            : course.difficulty === "Intermediate"
                            ? "bg-yellow-100 dark:bg-yellow-600/20 text-yellow-600 dark:text-yellow-400"
                            : "bg-red-100 dark:bg-red-600/20 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {course.difficulty}
                      </span>
                    </div>

                    {!course.unlocked && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        🔒 Complete{" "}
                        {course.id === 6 ? "3 courses" : "trading activities"}{" "}
                        to unlock
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Course Content */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              {selectedLesson ? (
                <div>
                  <div className="text-4xl mb-4">{selectedLesson.icon}</div>
                  <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-white">
                    {selectedLesson.title}
                  </h3>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Lessons:
                    </p>
                    <ul className="space-y-1">
                      {selectedLesson.lessons.map((lesson, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                        >
                          <span className="text-primary-500 mt-0.5">•</span>
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className="prose prose-sm dark:prose-invert max-w-none mb-4 text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
                  />

                  {!selectedLesson.completed && (
                    <button
                      onClick={() => handleCompleteLesson(selectedLesson.id)}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark as Complete
                    </button>
                  )}

                  {selectedLesson.completed && (
                    <div className="bg-green-100 dark:bg-green-600/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-center">
                      <CheckCircle className="w-5 h-5 inline mr-2" />
                      Course Completed!
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a course to view content</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default MicroCourse;
