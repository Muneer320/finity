import Layout from "../components/Layout";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Clock,
  Trophy,
  CheckCircle2,
  Filter,
  TrendingDown as SellIcon,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAchievement } from "../context/AchievementContext";
import {
  awardAchievement,
  ACHIEVEMENT_TYPES,
  incrementTradeCount,
  checkDiamondHands,
  checkTradingPro,
} from "../utils/achievementManager";
import { marketAPI } from "../utils/api";

function Trading() {
  const { showAchievement } = useAchievement();
  const [balance, setBalance] = useState(100000); // Starting F-Coins - fallback
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [portfolio, setPortfolio] = useState([]);
  const [livePortfolio, setLivePortfolio] = useState(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [lastPurchase, setLastPurchase] = useState(null);
  const [stockFilter, setStockFilter] = useState("all"); // all, positive, negative, dividend, largeCap, midCap, smallCap
  const [fundFilter, setFundFilter] = useState("all");
  const [tradeMode, setTradeMode] = useState("buy"); // buy or sell
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [assetHistory, setAssetHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedAssetForChart, setSelectedAssetForChart] = useState(null);

  // Fetch live portfolio from backend
  const fetchLivePortfolio = async () => {
    setPortfolioLoading(true);
    try {
      const response = await marketAPI.getLiveFeed();
      setLivePortfolio(response);
      console.log("Live portfolio data:", response);

      // Update balance from API if available
      if (response.available_balance !== undefined) {
        setBalance(response.available_balance);
      }
    } catch (err) {
      console.error("Failed to fetch live portfolio:", err);
    } finally {
      setPortfolioLoading(false);
    }
  };

  useEffect(() => {
    // Fetch portfolio on mount
    fetchLivePortfolio();

    // Refresh every 30 seconds
    const interval = setInterval(fetchLivePortfolio, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch asset history from backend
  const fetchAssetHistory = async (symbol) => {
    setLoadingHistory(true);
    setSelectedAssetForChart(symbol);
    try {
      const history = await marketAPI.getAssetHistory(symbol);
      setAssetHistory(history);
      console.log("Asset history for", symbol, ":", history);
    } catch (err) {
      console.error("Failed to fetch asset history:", err);
      setAssetHistory(null);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Generate mock trend data for stocks
  const generateTrendData = (basePrice, positive) => {
    const points = [];
    let price = basePrice * 0.95; // Start from 95% of current price

    for (let i = 0; i < 30; i++) {
      const change = (Math.random() - 0.5) * basePrice * 0.02;
      price += change;
      if (positive && i > 15) {
        price += Math.random() * basePrice * 0.01; // Trend upward
      } else if (!positive && i > 15) {
        price -= Math.random() * basePrice * 0.01; // Trend downward
      }
      points.push(price);
    }
    return points;
  };

  // Fallback mock stocks data
  const fallbackStocks = [
    {
      id: 1,
      symbol: "TECH",
      name: "Tech Corp",
      price: 2500,
      change: 5.2,
      positive: true,
      category: "Technology",
      trend: null,
      dividend: 2.5,
      peRatio: 18.5,
      marketCap: "Large",
    },
    {
      id: 2,
      symbol: "FIN",
      name: "Finance Ltd",
      price: 1800,
      change: -2.1,
      positive: false,
      category: "Finance",
      trend: null,
      dividend: 0,
      peRatio: 22.3,
      marketCap: "Mid",
    },
    {
      id: 3,
      symbol: "HEALTH",
      name: "Health Inc",
      price: 3200,
      change: 3.8,
      positive: true,
      category: "Healthcare",
      trend: null,
      dividend: 3.2,
      peRatio: 15.7,
      marketCap: "Large",
    },
    {
      id: 4,
      symbol: "ENERGY",
      name: "Energy Co",
      price: 1500,
      change: -1.5,
      positive: false,
      category: "Energy",
      trend: null,
      dividend: 4.5,
      peRatio: 12.1,
      marketCap: "Mid",
    },
    {
      id: 5,
      symbol: "CONS",
      name: "Consumer Goods",
      price: 2100,
      change: 2.3,
      positive: true,
      category: "Consumer",
      trend: null,
      dividend: 1.8,
      peRatio: 20.4,
      marketCap: "Small",
    },
  ];

  const fallbackMutualFunds = [
    {
      id: 6,
      symbol: "BALANCED",
      name: "Balanced Fund",
      price: 5000,
      change: 1.8,
      positive: true,
      category: "Mutual Fund",
      trend: null,
      riskLevel: "Medium",
      returns3Y: 12.5,
    },
    {
      id: 7,
      symbol: "GROWTH",
      name: "Growth Fund",
      price: 8000,
      change: 4.2,
      positive: true,
      category: "Mutual Fund",
      trend: null,
      riskLevel: "High",
      returns3Y: 18.3,
    },
    {
      id: 8,
      symbol: "DEBT",
      name: "Debt Fund",
      price: 3500,
      change: 0.8,
      positive: true,
      category: "Mutual Fund",
      trend: null,
      riskLevel: "Low",
      returns3Y: 7.2,
    },
  ];

  // Use API data if available, otherwise use fallback
  const stocks = livePortfolio?.available_stocks || fallbackStocks;
  const mutualFunds =
    livePortfolio?.available_mutual_funds || fallbackMutualFunds;

  // Generate trends for each asset (only if not already present from API)
  stocks.forEach((stock) => {
    if (!stock.trend) {
      stock.trend = generateTrendData(stock.price, stock.positive);
    }
  });

  mutualFunds.forEach((fund) => {
    if (!fund.trend) {
      fund.trend = generateTrendData(fund.price, fund.positive);
    }
  });

  const allAssets = [...stocks, ...mutualFunds];

  const handleBuy = async () => {
    if (!selectedStock || quantity < 1) return;

    const totalCost = selectedStock.price * quantity;
    if (totalCost > balance) {
      alert("Insufficient F-Coins!");
      return;
    }

    try {
      // Execute buy action via backend API
      const actionData = {
        asset_type: selectedStock.type || "Stock", // "Stock" or "Mutual Fund"
        symbol: selectedStock.symbol,
        action: "Buy", // Capitalized as expected by backend
        amount: quantity,
      };

      const response = await marketAPI.executeAction(actionData);
      console.log("Buy action response:", response);

      // Update local portfolio (will be replaced by backend data on next refresh)
      const existingHolding = portfolio.find((p) => p.id === selectedStock.id);
      if (existingHolding) {
        const updatedPortfolio = portfolio.map((p) =>
          p.id === selectedStock.id
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
        setPortfolio(updatedPortfolio);
      } else {
        setPortfolio([
          ...portfolio,
          { ...selectedStock, quantity, boughtAt: selectedStock.price },
        ]);
      }

      setBalance(balance - totalCost);

      // Refresh live portfolio data
      await fetchLivePortfolio();

      // Increment trade count and check for achievements
      incrementTradeCount();

      // Award First Trade achievement
      const firstTradeAchievement = {
        icon: "📈",
        name: ACHIEVEMENT_TYPES.FIRST_TRADE,
        description: "Executed your first mock trade!",
      };
      const awardedFirstTrade = awardAchievement(firstTradeAchievement);
      if (awardedFirstTrade) {
        showAchievement(firstTradeAchievement);
      }

      // Check Trading Pro achievement (50+ trades)
      const tradingProAchievement = checkTradingPro();
      if (tradingProAchievement) {
        showAchievement(tradingProAchievement);
      }

      // Calculate new portfolio value and check Diamond Hands
      const newPortfolioValue = [
        ...portfolio,
        { ...selectedStock, quantity, boughtAt: selectedStock.price },
      ].reduce((sum, holding) => sum + holding.price * holding.quantity, 0);
      const diamondHandsAchievement = checkDiamondHands(newPortfolioValue);
      if (diamondHandsAchievement) {
        showAchievement(diamondHandsAchievement);
      }

      setSelectedStock(null);
      setQuantity(1);

      // Show success animation
      setLastPurchase({
        symbol: selectedStock.symbol,
        quantity,
        amount: totalCost,
        type: "buy",
      });
      setShowSuccessAnimation(true);

      // Hide animation after 3 seconds
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 3000);
    } catch (error) {
      console.error("Buy action failed:", error);
      alert(error.message || "Failed to execute buy order. Please try again.");
    }
  };

  const handleSell = async () => {
    if (!selectedHolding || quantity < 1) return;

    const holding = portfolio.find((p) => p.id === selectedHolding.id);
    if (!holding || quantity > holding.quantity) {
      alert("Invalid quantity!");
      return;
    }

    try {
      const saleValue = selectedHolding.price * quantity;

      // Execute sell action via backend API
      const actionData = {
        asset_type: selectedHolding.type || "Stock", // "Stock" or "Mutual Fund"
        symbol: selectedHolding.symbol,
        action: "Sell", // Capitalized as expected by backend
        amount: quantity,
      };

      const response = await marketAPI.executeAction(actionData);
      console.log("Sell action response:", response);
      console.log("Sell action response:", response);

      // Update local portfolio
      const updatedPortfolio = portfolio
        .map((p) =>
          p.id === selectedHolding.id
            ? { ...p, quantity: p.quantity - quantity }
            : p
        )
        .filter((p) => p.quantity > 0);

      setPortfolio(updatedPortfolio);
      setBalance(balance + saleValue);

      // Refresh live portfolio data
      await fetchLivePortfolio();

      // Increment trade count and check for achievements
      incrementTradeCount();

      // Check Trading Pro achievement (50+ trades)
      const tradingProAchievement = checkTradingPro();
      if (tradingProAchievement) {
        showAchievement(tradingProAchievement);
      }

      // Calculate new portfolio value and check Diamond Hands
      const newPortfolioValue = updatedPortfolio.reduce(
        (sum, holding) => sum + holding.price * holding.quantity,
        0
      );
      const diamondHandsAchievement = checkDiamondHands(newPortfolioValue);
      if (diamondHandsAchievement) {
        showAchievement(diamondHandsAchievement);
      }

      setSelectedHolding(null);
      setQuantity(1);

      // Show success animation
      setLastPurchase({
        symbol: selectedHolding.symbol,
        quantity,
        amount: saleValue,
        type: "sell",
      });
      setShowSuccessAnimation(true);

      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 3000);
    } catch (error) {
      console.error("Sell action failed:", error);
      alert(error.message || "Failed to execute sell order. Please try again.");
    }
  };

  const portfolioValue = portfolio.reduce(
    (sum, holding) => sum + holding.price * holding.quantity,
    0
  );

  const totalInvested = portfolio.reduce(
    (sum, holding) => sum + holding.boughtAt * holding.quantity,
    0
  );

  const profitLoss = portfolioValue - totalInvested;

  // Render mini trend chart
  const renderTrendChart = (trendData, positive) => {
    if (!trendData) return null;

    const max = Math.max(...trendData);
    const min = Math.min(...trendData);
    const range = max - min;

    const points = trendData
      .map((price, i) => {
        const x = (i / (trendData.length - 1)) * 200;
        const y = 60 - ((price - min) / range) * 50;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width="200" height="60" className="mt-2">
        <polyline
          points={points}
          fill="none"
          stroke={positive ? "#22c55e" : "#ef4444"}
          strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <Layout>
      {/* Success Animation */}
      <AnimatePresence>
        {showSuccessAnimation && lastPurchase && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white dark:bg-dark-900 rounded-2xl p-8 max-w-md mx-4 border border-gray-200 dark:border-dark-800 shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-display font-bold text-center mb-2 text-gray-900 dark:text-white"
              >
                {lastPurchase.type === "buy" ? "Purchase" : "Sale"} Successful!
              </motion.h3>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center space-y-2"
              >
                <p className="text-gray-600 dark:text-gray-400">
                  Successfully{" "}
                  {lastPurchase.type === "buy" ? "purchased" : "sold"}
                </p>
                <p
                  className={`text-xl font-mono font-bold ${
                    lastPurchase.type === "buy"
                      ? "text-primary-600"
                      : "text-green-600"
                  }`}
                >
                  {lastPurchase.quantity} × {lastPurchase.symbol}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total: ₹{lastPurchase.amount.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 flex gap-2"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="text-4xl mx-auto"
                >
                  🎉
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="text-4xl mx-auto"
                >
                  📈
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="text-4xl mx-auto"
                >
                  💰
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2 text-gray-900 dark:text-white">
            FinityArena
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Practice trading with virtual F-Coins
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-primary-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Available Balance
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              ₹{balance.toLocaleString()}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Portfolio Value
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              ₹{portfolioValue.toLocaleString()}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Total Invested
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              ₹{totalInvested.toLocaleString()}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              {profitLoss >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                P&L
              </span>
            </div>
            <p
              className={`text-2xl font-display font-bold ${
                profitLoss >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ₹{Math.abs(profitLoss).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white">
                  Available Stocks
                </h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="text-sm bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg px-3 py-1.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="all">All</option>
                    <option value="positive">Gainers</option>
                    <option value="negative">Losers</option>
                    <option value="dividend">Dividend Stocks</option>
                    <option value="largeCap">Large Cap</option>
                    <option value="midCap">Mid Cap</option>
                    <option value="smallCap">Small Cap</option>
                    <option value="lowPE">Low P/E (&lt; 15)</option>
                    <option value="highPrice">High Price (&gt; ₹2000)</option>
                    <option value="lowPrice">Low Price (&lt; ₹2000)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {stocks
                  .filter((stock) => {
                    if (stockFilter === "positive") return stock.positive;
                    if (stockFilter === "negative") return !stock.positive;
                    if (stockFilter === "dividend") return stock.dividend > 0;
                    if (stockFilter === "largeCap")
                      return stock.marketCap === "Large";
                    if (stockFilter === "midCap")
                      return stock.marketCap === "Mid";
                    if (stockFilter === "smallCap")
                      return stock.marketCap === "Small";
                    if (stockFilter === "lowPE") return stock.peRatio < 15;
                    if (stockFilter === "highPrice") return stock.price > 2000;
                    if (stockFilter === "lowPrice") return stock.price < 2000;
                    return true;
                  })
                  .map((stock) => (
                    <div
                      key={stock.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedStock?.id === stock.id
                          ? "border-primary-600 bg-primary-600/5"
                          : "border-gray-200 dark:border-dark-800 hover:border-gray-300 dark:hover:border-dark-700"
                      }`}
                    >
                      <div
                        onClick={() => setSelectedStock(stock)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-gray-900 dark:text-white">
                                {stock.symbol}
                              </span>
                              <span className="badge bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 text-xs">
                                {stock.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {stock.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-bold text-gray-900 dark:text-white">
                              ₹{stock.price}
                            </p>
                            <p
                              className={`text-sm flex items-center gap-1 ${
                                stock.positive
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {stock.positive ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              {stock.change}%
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchAssetHistory(stock.symbol);
                        }}
                        className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:underline w-full text-left"
                      >
                        📊 View Price History
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white">
                  Mutual Funds
                </h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <select
                    value={fundFilter}
                    onChange={(e) => setFundFilter(e.target.value)}
                    className="text-sm bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg px-3 py-1.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="all">All</option>
                    <option value="positive">High Returns (&gt; 3%)</option>
                    <option value="lowRisk">Low Risk</option>
                    <option value="mediumRisk">Medium Risk</option>
                    <option value="highRisk">High Risk</option>
                    <option value="highReturns3Y">
                      Best 3Y Returns (&gt; 15%)
                    </option>
                    <option value="lowPrice">Affordable (&lt; ₹5000)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {mutualFunds
                  .filter((fund) => {
                    if (fundFilter === "positive") return fund.change > 3;
                    if (fundFilter === "lowRisk")
                      return fund.riskLevel === "Low";
                    if (fundFilter === "mediumRisk")
                      return fund.riskLevel === "Medium";
                    if (fundFilter === "highRisk")
                      return fund.riskLevel === "High";
                    if (fundFilter === "highReturns3Y")
                      return fund.returns3Y > 15;
                    if (fundFilter === "lowPrice") return fund.price < 5000;
                    return true;
                  })
                  .map((fund) => (
                    <div
                      key={fund.id}
                      onClick={() => setSelectedStock(fund)}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedStock?.id === fund.id
                          ? "border-primary-600 bg-primary-600/5"
                          : "border-gray-200 dark:border-dark-800 hover:border-gray-300 dark:hover:border-dark-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-gray-900 dark:text-white">
                              {fund.symbol}
                            </span>
                            <span className="badge bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 text-xs">
                              {fund.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {fund.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-gray-900 dark:text-white">
                            ₹{fund.price}
                          </p>
                          <p className="text-sm text-green-500 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {fund.change}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Trade Panel & Portfolio */}
          <div className="space-y-4">
            {/* Trade Panel */}
            <div className="card">
              <h2 className="text-xl font-display font-semibold mb-4 text-gray-900 dark:text-white">
                Place Order
              </h2>

              {/* Buy/Sell Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    setTradeMode("buy");
                    setSelectedHolding(null);
                    setQuantity(1);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    tradeMode === "buy"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 inline mr-2" />
                  Buy
                </button>
                <button
                  onClick={() => {
                    setTradeMode("sell");
                    setSelectedStock(null);
                    setQuantity(1);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    tradeMode === "sell"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <SellIcon className="w-4 h-4 inline mr-2" />
                  Sell
                </button>
              </div>

              {tradeMode === "buy" && selectedStock ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Selected
                    </p>
                    <p className="font-mono font-bold text-lg text-gray-900 dark:text-white">
                      {selectedStock.symbol}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedStock.name}
                    </p>
                    <p className="font-mono font-bold text-primary-500 mt-2">
                      ₹{selectedStock.price}
                    </p>

                    {/* Trend Chart */}
                    <div className="mt-4 border-t border-gray-200 dark:border-dark-700 pt-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        30-Day Trend
                      </p>
                      {renderTrendChart(
                        selectedStock.trend,
                        selectedStock.positive
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">30d ago</span>
                        <span
                          className={`text-xs flex items-center gap-1 ${
                            selectedStock.positive
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {selectedStock.positive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {selectedStock.change}%
                        </span>
                        <span className="text-xs text-gray-500">Today</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 1)
                      }
                      className="input-field"
                    />
                  </div>

                  <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Cost
                      </span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        ₹{(selectedStock.price * quantity).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Available
                      </span>
                      <span className="font-mono text-gray-900 dark:text-white">
                        ₹{balance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleBuy}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                    disabled={selectedStock.price * quantity > balance}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Buy Now
                  </button>
                </div>
              ) : tradeMode === "sell" && selectedHolding ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Selling
                    </p>
                    <p className="font-mono font-bold text-lg text-gray-900 dark:text-white">
                      {selectedHolding.symbol}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedHolding.name}
                    </p>
                    <p className="font-mono font-bold text-green-600 mt-2">
                      ₹{selectedHolding.price}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      You own:{" "}
                      {portfolio.find((p) => p.id === selectedHolding.id)
                        ?.quantity || 0}{" "}
                      shares
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantity to Sell
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={
                        portfolio.find((p) => p.id === selectedHolding.id)
                          ?.quantity || 0
                      }
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 1)
                      }
                      className="input-field"
                    />
                  </div>

                  <div className="p-4 bg-gray-100 dark:bg-dark-800 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Sale Value
                      </span>
                      <span className="font-mono font-bold text-green-600">
                        ₹{(selectedHolding.price * quantity).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Current Balance
                      </span>
                      <span className="font-mono text-gray-900 dark:text-white">
                        ₹{balance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSell}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200"
                    disabled={
                      quantity >
                      (portfolio.find((p) => p.id === selectedHolding.id)
                        ?.quantity || 0)
                    }
                  >
                    <SellIcon className="w-5 h-5" />
                    Sell Now
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>
                    {tradeMode === "buy"
                      ? "Select a stock or fund to buy"
                      : "Select a holding to sell"}
                  </p>
                </div>
              )}
            </div>

            {/* Portfolio */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white">
                  Your Holdings
                </h2>
                <button
                  onClick={fetchLivePortfolio}
                  disabled={portfolioLoading}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                  title="Refresh portfolio"
                >
                  <RefreshCw
                    className={`w-4 h-4 text-gray-600 dark:text-gray-400 ${
                      portfolioLoading ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Live Portfolio Value */}
              {livePortfolio && (
                <div className="mb-4 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Total Portfolio Value
                      </p>
                      <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                        ₹{livePortfolio.total_portfolio_value?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Last Update
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(
                          livePortfolio.last_update
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {portfolioLoading && !livePortfolio ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-primary-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading portfolio...
                  </p>
                </div>
              ) : livePortfolio?.holdings?.length > 0 ? (
                <div className="space-y-3">
                  {livePortfolio.holdings.map((holding, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-100 dark:bg-dark-800 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-mono font-bold text-gray-900 dark:text-white">
                            {holding.symbol}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {holding.shares} shares @ ₹{holding.average_cost}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm text-gray-900 dark:text-white">
                            ₹{holding.current_value?.toLocaleString()}
                          </p>
                          <p
                            className={`text-xs font-medium ${
                              holding.gain_loss_percent >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {holding.gain_loss_percent >= 0 ? "+" : ""}
                            {holding.gain_loss_percent?.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          Current: ₹{holding.current_price}
                        </span>
                        <span
                          className={`font-medium ${
                            holding.gain_loss_percent >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {holding.gain_loss_percent >= 0 ? "↑" : "↓"} ₹
                          {Math.abs(
                            holding.current_value -
                              holding.shares * holding.average_cost
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : portfolio.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No holdings yet</p>
                  <p className="text-xs mt-1">
                    Start trading to build your portfolio
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.map((holding) => (
                    <div
                      key={holding.id}
                      onClick={() => {
                        setTradeMode("sell");
                        setSelectedHolding(holding);
                        setSelectedStock(null);
                        setQuantity(1);
                      }}
                      className={`p-3 bg-gray-100 dark:bg-dark-800 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedHolding?.id === holding.id &&
                        tradeMode === "sell"
                          ? "ring-2 ring-green-600"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-mono font-bold text-gray-900 dark:text-white">
                            {holding.symbol}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {holding.quantity} shares
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm text-gray-900 dark:text-white">
                            ₹
                            {(
                              holding.price * holding.quantity
                            ).toLocaleString()}
                          </p>
                          <p
                            className={`text-xs ${
                              holding.price > holding.boughtAt
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {holding.price > holding.boughtAt ? "+" : ""}
                            {(
                              ((holding.price - holding.boughtAt) /
                                holding.boughtAt) *
                              100
                            ).toFixed(2)}
                            %
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Asset History Chart Modal */}
        {assetHistory && selectedAssetForChart && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setAssetHistory(null);
              setSelectedAssetForChart(null);
            }}
          >
            <div
              className="bg-white dark:bg-dark-900 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                  {selectedAssetForChart} - Price History
                </h3>
                <button
                  onClick={() => {
                    setAssetHistory(null);
                    setSelectedAssetForChart(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <pre className="text-sm bg-gray-100 dark:bg-dark-800 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(assetHistory, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Trading;
