import Layout from '../components/Layout';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Clock, Trophy } from 'lucide-react';
import { useState } from 'react';

function Trading() {
  const [balance] = useState(100000); // Starting F-Coins
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [portfolio, setPortfolio] = useState([]);

  // Mock stocks data
  const stocks = [
    { id: 1, symbol: 'TECH', name: 'Tech Corp', price: 2500, change: 5.2, positive: true, category: 'Technology' },
    { id: 2, symbol: 'FIN', name: 'Finance Ltd', price: 1800, change: -2.1, positive: false, category: 'Finance' },
    { id: 3, symbol: 'HEALTH', name: 'Health Inc', price: 3200, change: 3.8, positive: true, category: 'Healthcare' },
    { id: 4, symbol: 'ENERGY', name: 'Energy Co', price: 1500, change: -1.5, positive: false, category: 'Energy' },
    { id: 5, symbol: 'CONS', name: 'Consumer Goods', price: 2100, change: 2.3, positive: true, category: 'Consumer' },
  ];

  const mutualFunds = [
    { id: 6, symbol: 'BALANCED', name: 'Balanced Fund', price: 5000, change: 1.8, positive: true, category: 'Mutual Fund' },
    { id: 7, symbol: 'GROWTH', name: 'Growth Fund', price: 8000, change: 4.2, positive: true, category: 'Mutual Fund' },
  ];

  const allAssets = [...stocks, ...mutualFunds];

  const handleBuy = () => {
    if (!selectedStock || quantity < 1) return;
    
    const totalCost = selectedStock.price * quantity;
    if (totalCost > balance) {
      alert('Insufficient F-Coins!');
      return;
    }

    const existingHolding = portfolio.find(p => p.id === selectedStock.id);
    if (existingHolding) {
      const updatedPortfolio = portfolio.map(p =>
        p.id === selectedStock.id
          ? { ...p, quantity: p.quantity + quantity }
          : p
      );
      setPortfolio(updatedPortfolio);
    } else {
      setPortfolio([...portfolio, { ...selectedStock, quantity, boughtAt: selectedStock.price }]);
    }

    // Award badge for first trade
    const badges = JSON.parse(localStorage.getItem('badges') || '[]');
    if (!badges.some(b => b.name === 'First Trade')) {
      badges.push({
        icon: '📈',
        name: 'First Trade',
        description: 'Executed your first mock trade!',
        date: new Date().toISOString()
      });
      localStorage.setItem('badges', JSON.stringify(badges));
    }

    setSelectedStock(null);
    setQuantity(1);
    alert(`Successfully bought ${quantity} shares of ${selectedStock.symbol}!`);
  };

  const portfolioValue = portfolio.reduce((sum, holding) => 
    sum + (holding.price * holding.quantity), 0
  );

  const totalInvested = portfolio.reduce((sum, holding) => 
    sum + (holding.boughtAt * holding.quantity), 0
  );

  const profitLoss = portfolioValue - totalInvested;

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Mock Trading Platform</h1>
          <p className="text-gray-400">Practice trading with virtual F-Coins</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-primary-500" />
              <span className="text-gray-400 text-sm">Available Balance</span>
            </div>
            <p className="text-2xl font-display font-bold">₹{balance.toLocaleString()}</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-gray-400 text-sm">Portfolio Value</span>
            </div>
            <p className="text-2xl font-display font-bold">₹{portfolioValue.toLocaleString()}</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-400 text-sm">Total Invested</span>
            </div>
            <p className="text-2xl font-display font-bold">₹{totalInvested.toLocaleString()}</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              {profitLoss >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
              <span className="text-gray-400 text-sm">P&L</span>
            </div>
            <p className={`text-2xl font-display font-bold ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ₹{Math.abs(profitLoss).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card">
              <h2 className="text-xl font-display font-semibold mb-4">Available Stocks</h2>
              <div className="space-y-3">
                {stocks.map((stock) => (
                  <div
                    key={stock.id}
                    onClick={() => setSelectedStock(stock)}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedStock?.id === stock.id
                        ? 'border-primary-600 bg-primary-600/5'
                        : 'border-dark-800 hover:border-dark-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold">{stock.symbol}</span>
                          <span className="badge bg-dark-800 text-gray-400 text-xs">
                            {stock.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold">₹{stock.price}</p>
                        <p className={`text-sm flex items-center gap-1 ${stock.positive ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {stock.change}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-display font-semibold mb-4">Mutual Funds</h2>
              <div className="space-y-3">
                {mutualFunds.map((fund) => (
                  <div
                    key={fund.id}
                    onClick={() => setSelectedStock(fund)}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedStock?.id === fund.id
                        ? 'border-primary-600 bg-primary-600/5'
                        : 'border-dark-800 hover:border-dark-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold">{fund.symbol}</span>
                          <span className="badge bg-purple-600/20 text-purple-400 text-xs">
                            {fund.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{fund.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold">₹{fund.price}</p>
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
              <h2 className="text-xl font-display font-semibold mb-4">Place Order</h2>
              
              {selectedStock ? (
                <div className="space-y-4">
                  <div className="p-4 bg-dark-800 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Selected</p>
                    <p className="font-mono font-bold text-lg">{selectedStock.symbol}</p>
                    <p className="text-sm text-gray-400">{selectedStock.name}</p>
                    <p className="font-mono font-bold text-primary-500 mt-2">₹{selectedStock.price}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="input-field"
                    />
                  </div>

                  <div className="p-4 bg-dark-800 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Total Cost</span>
                      <span className="font-mono font-bold">₹{(selectedStock.price * quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Available</span>
                      <span className="font-mono">₹{balance.toLocaleString()}</span>
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
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a stock or fund to trade</p>
                </div>
              )}
            </div>

            {/* Portfolio */}
            <div className="card">
              <h2 className="text-xl font-display font-semibold mb-4">Your Holdings</h2>
              
              {portfolio.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No holdings yet</p>
                  <p className="text-xs mt-1">Start trading to build your portfolio</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.map((holding) => (
                    <div key={holding.id} className="p-3 bg-dark-800 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-mono font-bold">{holding.symbol}</p>
                          <p className="text-xs text-gray-400">{holding.quantity} shares</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm">₹{(holding.price * holding.quantity).toLocaleString()}</p>
                          <p className={`text-xs ${holding.price > holding.boughtAt ? 'text-green-500' : 'text-red-500'}`}>
                            {holding.price > holding.boughtAt ? '+' : ''}
                            {((holding.price - holding.boughtAt) / holding.boughtAt * 100).toFixed(2)}%
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
      </div>
    </Layout>
  );
}

export default Trading;
