import Layout from "../components/Layout";
import {
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAchievement } from "../context/AchievementContext";
import {
  awardAchievement,
  ACHIEVEMENT_TYPES,
} from "../utils/achievementManager";
import { expenseAPI, incomeAPI, gamificationAPI } from "../utils/api";

function Expenses() {
  const { showAchievement } = useAchievement();
  const [transactions, setTransactions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, income, expense
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dailyPrompt, setDailyPrompt] = useState(null);
  const [promptLoading, setPromptLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Other",
  ];

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Investment",
    "Gift",
    "Other",
  ];

  useEffect(() => {
    // Load transactions from localStorage
    const saved = JSON.parse(localStorage.getItem("transactions") || "[]");
    setTransactions(saved);

    // Fetch daily prompt
    const fetchDailyPrompt = async () => {
      try {
        const response = await gamificationAPI.getDailyPrompt();
        setDailyPrompt(response);
      } catch (err) {
        console.error("Failed to fetch daily prompt:", err);
      } finally {
        setPromptLoading(false);
      }
    };

    fetchDailyPrompt();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;

      if (formData.type === "expense") {
        // Create expense via API
        response = await expenseAPI.create({
          amount: parseFloat(formData.amount),
          category: formData.category,
          note: formData.description,
          date: null, // Backend expects null, will auto-generate timestamp
        });
      } else {
        // Create income via API
        response = await incomeAPI.create({
          amount: parseFloat(formData.amount),
          source: formData.category,
          date: null, // Backend expects null, will auto-generate timestamp
        });
      }

      // Add to local state with backend response
      const newTransaction = {
        id: response.id,
        type: formData.type,
        amount: response.amount,
        category:
          formData.type === "expense" ? response.category : response.source,
        description:
          formData.type === "expense"
            ? response.note
            : `Income from ${response.source}`,
        date: formData.date,
        timestamp: response.date,
        owner_id: response.owner_id,
      };

      const updated = [newTransaction, ...transactions];
      setTransactions(updated);
      localStorage.setItem("transactions", JSON.stringify(updated));

      // Award achievement for first transaction
      const moneyManagerAchievement = {
        icon: "💰",
        name: ACHIEVEMENT_TYPES.MONEY_MANAGER,
        description: "Logged your first transaction!",
      };
      const awarded = awardAchievement(moneyManagerAchievement);
      if (awarded) {
        showAchievement(moneyManagerAchievement);
      }

      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to create transaction:", err);
      setError(err.message || "Failed to save transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    localStorage.setItem("transactions", JSON.stringify(updated));
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "all") return true;
    return t.type === filterType;
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Expenses & Earnings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your income and expenses
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>

        {/* Daily Prompt Card */}
        {!promptLoading && dailyPrompt && (
          <div className="mb-6 card bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-primary-500/10 border-2 border-purple-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg flex-shrink-0">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    {dailyPrompt.type || "Daily Challenge"}
                  </span>
                </div>
                <p className="text-gray-900 dark:text-white font-medium">
                  {dailyPrompt.text}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary text-sm whitespace-nowrap"
              >
                Log Now
              </button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-600/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Total Income
              </span>
            </div>
            <p className="text-3xl font-display font-bold text-green-500">
              ₹{totalIncome.toLocaleString()}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-red-600/10 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-500" />
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Total Expenses
              </span>
            </div>
            <p className="text-3xl font-display font-bold text-red-500">
              ₹{totalExpense.toLocaleString()}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary-600/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary-500" />
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Net Balance
              </span>
            </div>
            <p
              className={`text-3xl font-display font-bold ${
                balance >= 0 ? "text-primary-500" : "text-red-500"
              }`}
            >
              ₹{Math.abs(balance).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterType === "all"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("income")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterType === "income"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700"
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setFilterType("expense")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterType === "expense"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700"
                }`}
              >
                Expenses
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="card">
          <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4">
            Recent Transactions
          </h2>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No transactions yet</p>
              <p className="text-sm mt-1">
                Add your first transaction to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-100 dark:bg-dark-800 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-700 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        transaction.type === "income"
                          ? "bg-green-600/10"
                          : "bg-red-600/10"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.category}
                      </p>
                      {transaction.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-500 dark:text-gray-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p
                      className={`text-xl font-mono font-bold ${
                        transaction.type === "income"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}₹
                      {transaction.amount.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Transaction Modal */}
        {showAddModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="bg-white dark:bg-dark-900 rounded-xl p-6 max-w-md w-full border border-gray-300 dark:border-dark-800"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
                Add Transaction
              </h3>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          type: "income",
                          category: "",
                        })
                      }
                      className={`py-3 rounded-lg border-2 transition-all ${
                        formData.type === "income"
                          ? "border-green-600 bg-green-600/10 text-green-500"
                          : "border-gray-300 dark:border-dark-700 text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      Income
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          type: "expense",
                          category: "",
                        })
                      }
                      className={`py-3 rounded-lg border-2 transition-all ${
                        formData.type === "expense"
                          ? "border-red-600 bg-red-600/10 text-red-500"
                          : "border-gray-300 dark:border-dark-700 text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      Expense
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="input-field"
                    placeholder="1000"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="">Select category</option>
                    {(formData.type === "income"
                      ? incomeCategories
                      : expenseCategories
                    ).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Add a note..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-primary flex-1 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Add Transaction"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={loading}
                    className={`btn-secondary flex-1 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Expenses;
