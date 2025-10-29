import Layout from "../components/Layout";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
} from "lucide-react";
import { useState, useEffect } from "react";
import { marketAPI } from "../utils/api";

function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [timeRange, setTimeRange] = useState("month"); // week, month, year

  // Investment Simulator State
  const [simStart, setSimStart] = useState(10000);
  const [simMonthly, setSimMonthly] = useState(5000);
  const [simYears, setSimYears] = useState(10);
  const [simRisk, setSimRisk] = useState("Medium");
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("transactions") || "[]");
    setTransactions(saved);
  }, []);

  // Calculate category spending
  const getCategoryData = () => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const categoryMap = {};

    expenses.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    return Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage:
          expenses.reduce((sum, t) => sum + t.amount, 0) > 0
            ? (amount / expenses.reduce((sum, t) => sum + t.amount, 0)) * 100
            : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  // Calculate daily spending for bar chart
  const getDailyData = () => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayExpenses = transactions
        .filter((t) => t.type === "expense" && t.date === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);

      const dayIncome = transactions
        .filter((t) => t.type === "income" && t.date === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);

      last7Days.push({
        date: dateStr,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        expenses: dayExpenses,
        income: dayIncome,
      });
    }

    return last7Days;
  };

  // Calculate monthly trends
  const getMonthlyTrends = () => {
    const last6Months = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const monthExpenses = transactions
        .filter((t) => t.type === "expense" && t.date.startsWith(monthStr))
        .reduce((sum, t) => sum + t.amount, 0);

      const monthIncome = transactions
        .filter((t) => t.type === "income" && t.date.startsWith(monthStr))
        .reduce((sum, t) => sum + t.amount, 0);

      last6Months.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        expenses: monthExpenses,
        income: monthIncome,
        savings: monthIncome - monthExpenses,
      });
    }

    return last6Months;
  };

  // Calculate expense logging frequency for heatmap (last 90 days)
  const getHeatmapData = () => {
    const heatmapData = {};
    const today = new Date();

    // Initialize last 90 days
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      heatmapData[dateStr] = 0;
    }

    // Count transactions per day
    transactions.forEach((t) => {
      if (heatmapData.hasOwnProperty(t.date)) {
        heatmapData[t.date]++;
      }
    });

    return heatmapData;
  };

  const categoryData = getCategoryData();
  const dailyData = getDailyData();
  const monthlyData = getMonthlyTrends();
  const heatmapData = getHeatmapData();

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const colors = [
    "bg-primary-600",
    "bg-green-600",
    "bg-yellow-600",
    "bg-red-600",
    "bg-purple-600",
    "bg-pink-600",
    "bg-indigo-600",
    "bg-orange-600",
  ];

  // Handle investment simulation
  const handleSimulate = async () => {
    setSimLoading(true);
    try {
      const result = await marketAPI.simulateInvestment({
        start: simStart,
        monthly: simMonthly,
        years: simYears,
        risk: simRisk,
      });
      setSimResult(result);
      console.log("Simulation result:", result);
    } catch (error) {
      console.error("Simulation error:", error);
      setSimResult("Error running simulation. Please try again.");
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Analytics & Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize your spending patterns and trends
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-primary-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Avg. Daily Spending
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              ₹
              {dailyData.length > 0
                ? Math.round(
                    dailyData.reduce((sum, d) => sum + d.expenses, 0) /
                      dailyData.length
                  ).toLocaleString()
                : 0}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Savings Rate
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-green-500">
              {savingsRate.toFixed(1)}%
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Top Category
              </span>
            </div>
            <p className="text-xl font-display font-bold text-gray-900 dark:text-white truncate">
              {categoryData[0]?.category || "N/A"}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Transactions
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              {transactions.length}
            </p>
          </div>
        </div>

        {/* Investment Simulator */}
        <div className="card mb-6 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white">
              Investment Simulator
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Simulate long-term investment growth and get AI-generated learning
            insights
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Initial Amount (₹)
              </label>
              <input
                type="number"
                value={simStart}
                onChange={(e) => setSimStart(Number(e.target.value))}
                className="input-field"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monthly Investment (₹)
              </label>
              <input
                type="number"
                value={simMonthly}
                onChange={(e) => setSimMonthly(Number(e.target.value))}
                className="input-field"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Investment Period (Years)
              </label>
              <input
                type="number"
                value={simYears}
                onChange={(e) => setSimYears(Number(e.target.value))}
                className="input-field"
                min="1"
                max="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Risk Tolerance
              </label>
              <select
                value={simRisk}
                onChange={(e) => setSimRisk(e.target.value)}
                className="input-field"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={simLoading}
            className="btn-primary mb-4"
          >
            {simLoading ? "Simulating..." : "Run Simulation & Learn"}
          </button>

          {simResult && (
            <div className="space-y-6">
              {/* Simulation Results Cards */}
              {simResult.simulation_result && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90 mb-1">
                      Projected Final Value
                    </p>
                    <p className="text-2xl font-bold font-mono">
                      ₹
                      {simResult.simulation_result.projected_final_value?.toLocaleString()}
                    </p>
                    <p className="text-xs opacity-75 mt-1">
                      After {simResult.simulation_result.total_years} years
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90 mb-1">Total Gain</p>
                    <p className="text-2xl font-bold font-mono">
                      ₹{simResult.simulation_result.total_gain?.toLocaleString()}
                    </p>
                    <p className="text-xs opacity-75 mt-1">
                      {(
                        (simResult.simulation_result.total_gain /
                          simResult.simulation_result.total_contributed) *
                        100
                      ).toFixed(1)}
                      % growth
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90 mb-1">Total Contributed</p>
                    <p className="text-2xl font-bold font-mono">
                      ₹
                      {simResult.simulation_result.total_contributed?.toLocaleString()}
                    </p>
                    <p className="text-xs opacity-75 mt-1">
                      Your investment
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90 mb-1">Annual Return</p>
                    <p className="text-2xl font-bold font-mono">
                      {simResult.simulation_result.mock_annual_rate}%
                    </p>
                    <p className="text-xs opacity-75 mt-1">
                      {simRisk} risk profile
                    </p>
                  </div>
                </div>
              )}

              {/* AI-Generated Course Content */}
              {simResult.course_content && (
                <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border-2 border-primary-200 dark:border-primary-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                      🎓
                    </div>
                    <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                      AI-Generated Investment Masterclass
                    </h3>
                  </div>
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: simResult.course_content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/### (.*?)(\n|$)/g, "<h3>$1</h3>")
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Category Breakdown - Pie Chart Style */}
          <div className="card">
            <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-primary-500" />
              Spending by Category
            </h2>

            {categoryData.length === 0 ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                <p>No expense data yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Pie representation */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      {
                        categoryData.reduce(
                          (acc, item, index) => {
                            const percentage = item.percentage;
                            const color = colors[index % colors.length].replace(
                              "bg-",
                              ""
                            );
                            const colorMap = {
                              "primary-600": "#0284c7",
                              "green-600": "#16a34a",
                              "yellow-600": "#ca8a04",
                              "red-600": "#dc2626",
                              "purple-600": "#9333ea",
                              "pink-600": "#db2777",
                              "indigo-600": "#4f46e5",
                              "orange-600": "#ea580c",
                            };

                            const startAngle = acc.angle;
                            const angle = (percentage / 100) * 360;
                            const endAngle = startAngle + angle;

                            const x1 =
                              50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                            const y1 =
                              50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                            const x2 =
                              50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                            const y2 =
                              50 + 40 * Math.sin((endAngle * Math.PI) / 180);

                            const largeArc = angle > 180 ? 1 : 0;
                            const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

                            acc.angle = endAngle;
                            acc.segments.push(
                              <path
                                key={index}
                                d={path}
                                fill={colorMap[color]}
                                opacity="0.8"
                              />
                            );
                            return acc;
                          },
                          { angle: 0, segments: [] }
                        ).segments
                      }
                    </svg>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  {categoryData.map((item, index) => (
                    <div
                      key={item.category}
                      className="flex items-center justify-between p-3 bg-gray-100 dark:bg-dark-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            colors[index % colors.length]
                          }`}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-gray-900 dark:text-white">
                          ₹{item.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {item.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Daily Spending - Bar Chart */}
          <div className="card">
            <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary-500" />
              Last 7 Days
            </h2>

            <div className="space-y-4">
              {dailyData.map((day, index) => {
                const maxValue = Math.max(
                  ...dailyData.map((d) => Math.max(d.expenses, d.income))
                );
                const expenseWidth =
                  maxValue > 0 ? (day.expenses / maxValue) * 100 : 0;
                const incomeWidth =
                  maxValue > 0 ? (day.income / maxValue) * 100 : 0;

                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        {day.day}
                      </span>
                      <div className="flex gap-4">
                        <span className="text-red-500">-₹{day.expenses}</span>
                        <span className="text-green-500">+₹{day.income}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full bg-gray-200 dark:bg-dark-800 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all"
                          style={{ width: `${expenseWidth}%` }}
                        />
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-dark-800 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${incomeWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="card">
          <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary-500" />
            6-Month Trend
          </h2>

          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="h-64 flex items-end justify-between gap-4">
                {monthlyData.map((month, index) => {
                  const maxValue = Math.max(
                    ...monthlyData.map((m) => Math.max(m.expenses, m.income))
                  );
                  const expenseHeight =
                    maxValue > 0 ? (month.expenses / maxValue) * 100 : 0;
                  const incomeHeight =
                    maxValue > 0 ? (month.income / maxValue) * 100 : 0;

                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div className="w-full flex gap-2 h-56 items-end">
                        <div className="flex-1 bg-dark-800 rounded-t-lg relative group cursor-pointer">
                          <div
                            className="bg-red-600 rounded-t-lg absolute bottom-0 w-full transition-all hover:bg-red-500"
                            style={{ height: `${expenseHeight}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              ₹{month.expenses}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 bg-dark-800 rounded-t-lg relative group cursor-pointer">
                          <div
                            className="bg-green-600 rounded-t-lg absolute bottom-0 w-full transition-all hover:bg-green-500"
                            style={{ height: `${incomeHeight}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              ₹{month.income}
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">
                        {month.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded" />
                  <span className="text-sm text-gray-400">Expenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded" />
                  <span className="text-sm text-gray-400">Income</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-6">
          {/* Monthly Spending vs Savings */}
          <div className="card">
            <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary-500" />
              Monthly Spending vs. Savings
            </h2>

            {monthlyData.length === 0 ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                <p>No data available yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {monthlyData.map((month, index) => {
                  const totalValue = month.expenses + Math.abs(month.savings);
                  const spendingPercentage =
                    totalValue > 0 ? (month.expenses / totalValue) * 100 : 50;
                  const savingsPercentage =
                    totalValue > 0
                      ? (Math.abs(month.savings) / totalValue) * 100
                      : 50;

                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {month.month}
                        </span>
                        <div className="flex gap-4">
                          <span className="text-red-500 font-mono">
                            Spent: ₹{month.expenses.toLocaleString()}
                          </span>
                          <span
                            className={`font-mono ${
                              month.savings >= 0
                                ? "text-green-500"
                                : "text-orange-500"
                            }`}
                          >
                            Saved: ₹{month.savings.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
                        <div
                          className="bg-red-600 flex items-center justify-center text-white text-xs font-bold transition-all hover:bg-red-500"
                          style={{ width: `${spendingPercentage}%` }}
                        >
                          {spendingPercentage > 15 &&
                            `${spendingPercentage.toFixed(0)}%`}
                        </div>
                        <div
                          className={`${
                            month.savings >= 0
                              ? "bg-green-600 hover:bg-green-500"
                              : "bg-orange-600 hover:bg-orange-500"
                          } flex items-center justify-center text-white text-xs font-bold transition-all`}
                          style={{ width: `${savingsPercentage}%` }}
                        >
                          {savingsPercentage > 15 &&
                            `${savingsPercentage.toFixed(0)}%`}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-dark-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Spending
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Savings
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Expense Logging Frequency - Calendar Heatmap */}
          <div className="card">
            <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary-500" />
              Expense Logging Habit (Last 90 Days)
            </h2>

            <div>
              {/* Heatmap Grid */}
              <div className="space-y-2">
                {/* Generate 13 weeks (90 days) */}
                {Array.from({ length: 13 }, (_, weekIndex) => {
                  const today = new Date();
                  const startDay = 89 - weekIndex * 7;

                  return (
                    <div key={weekIndex} className="flex gap-1 items-center">
                      {weekIndex === 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right mr-2">
                          Week
                        </span>
                      )}
                      {weekIndex > 0 && <div className="w-8 mr-2" />}

                      {Array.from({ length: 7 }, (_, dayIndex) => {
                        const dayOffset = startDay - dayIndex;
                        if (dayOffset < 0) return null;

                        const date = new Date(today);
                        date.setDate(date.getDate() - dayOffset);
                        const dateStr = date.toISOString().split("T")[0];
                        const count = heatmapData[dateStr] || 0;

                        // Color intensity based on transaction count
                        let colorClass = "bg-gray-200 dark:bg-dark-800";
                        if (count >= 5) colorClass = "bg-green-600";
                        else if (count >= 3) colorClass = "bg-green-500";
                        else if (count >= 2) colorClass = "bg-green-400";
                        else if (count >= 1) colorClass = "bg-green-300";

                        return (
                          <div
                            key={dayIndex}
                            className={`w-3 h-3 rounded-sm ${colorClass} transition-all hover:scale-125 cursor-pointer relative group`}
                            title={`${dateStr}: ${count} transaction${
                              count !== 1 ? "s" : ""
                            }`}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-dark-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              {date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                              : {count} log{count !== 1 ? "s" : ""}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-dark-700">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Less
                </span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-gray-200 dark:bg-dark-800 rounded-sm" />
                  <div className="w-3 h-3 bg-green-300 rounded-sm" />
                  <div className="w-3 h-3 bg-green-400 rounded-sm" />
                  <div className="w-3 h-3 bg-green-500 rounded-sm" />
                  <div className="w-3 h-3 bg-green-600 rounded-sm" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  More
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Active Days
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {
                      Object.values(heatmapData).filter((count) => count > 0)
                        .length
                    }
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Avg. per Active Day
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {(
                      Object.values(heatmapData).reduce(
                        (sum, count) => sum + count,
                        0
                      ) /
                      Math.max(
                        Object.values(heatmapData).filter((count) => count > 0)
                          .length,
                        1
                      )
                    ).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Analytics;
