import React, { useState } from 'react';
import { Save } from 'lucide-react';

const AssetAllocationConfig = ({ onConfigSave, initialStrategies }) => {
  const [strategies, setStrategies] = useState(
    initialStrategies || [
      {
        id: 'conservative',
        name: 'Conservative',
        equity: 60,
        debt: 40,
        headerColor: 'bg-gray-600',
        borderColor: 'border-gray-300'
      },
      {
        id: 'growth',
        name: 'Growth',
        equity: 80,
        debt: 20,
        headerColor: 'bg-blue-600',
        borderColor: 'border-blue-300'
      },
      {
        id: 'aggressive',
        name: 'Aggressive',
        equity: 100,
        debt: 0,
        headerColor: 'bg-orange-600',
        borderColor: 'border-orange-300'
      }
    ]
  );

  const handleEquityChange = (index, value) => {
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    const newStrategies = [...strategies];
    newStrategies[index].equity = numValue;
    newStrategies[index].debt = 100 - numValue;
    setStrategies(newStrategies);
  };

  const handleDebtChange = (index, value) => {
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    const newStrategies = [...strategies];
    newStrategies[index].debt = numValue;
    newStrategies[index].equity = 100 - numValue;
    setStrategies(newStrategies);
  };

  const handleSave = () => {
    onConfigSave(strategies);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Configure Asset Allocation Strategies
      </h3>
      <p className="text-gray-600 mb-6">
        Set the Equity:Debt ratio for each strategy. The percentages must total 100%.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {strategies.map((strategy, index) => (
          <div
            key={strategy.id}
            className="border-2 rounded-lg p-4"
            style={{ borderColor: strategy.headerColor.replace('bg-', '') }}
          >
            <div className={`${strategy.headerColor} text-white font-bold text-center py-2 px-4 rounded-lg mb-4`}>
              {strategy.name}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Equity %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={strategy.equity}
                  onChange={(e) => handleEquityChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Debt %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={strategy.debt}
                  onChange={(e) => handleDebtChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Total: <span className={`font-bold ${strategy.equity + strategy.debt === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {strategy.equity + strategy.debt}%
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Save className="w-5 h-5" />
        Save & Generate Table
      </button>
    </div>
  );
};

export default AssetAllocationConfig;
