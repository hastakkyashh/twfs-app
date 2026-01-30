import React, { useState } from 'react';
import { Check, Edit2, Save } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/calculations';

const ResultTable = ({ projections, selectedStrategies, onToggleStrategy, onAllocationChange, onSaveAllocations, formData }) => {
  const [editMode, setEditMode] = useState(false);
  const [tempAllocations, setTempAllocations] = useState({});

  const handleEquityChange = (strategyId, value) => {
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    setTempAllocations(prev => ({
      ...prev,
      [strategyId]: {
        equity: numValue,
        debt: 100 - numValue
      }
    }));
  };

  const handleDebtChange = (strategyId, value) => {
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    setTempAllocations(prev => ({
      ...prev,
      [strategyId]: {
        equity: 100 - numValue,
        debt: numValue
      }
    }));
  };

  const handleSave = () => {
    onSaveAllocations(tempAllocations);
    setTempAllocations({});
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempAllocations({});
    setEditMode(false);
  };

  const getDisplayEquity = (strategy) => {
    return tempAllocations[strategy.id]?.equity ?? strategy.equity;
  };

  const getDisplayDebt = (strategy) => {
    return tempAllocations[strategy.id]?.debt ?? strategy.debt;
  };

  if (!projections || projections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading projections...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4 gap-3">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Allocations
          </button>
        ) : (
          <>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save & Recalculate
            </button>
          </>
        )}
      </div>
      <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="bg-gray-100 border border-gray-300 p-4 text-left font-bold text-gray-700">
              Asset Allocation
            </th>
            {projections.map((strategy) => (
              <th
                key={strategy.id}
                className={`${strategy.headerColor} border border-gray-300 p-4 text-white font-bold text-center`}
              >
                <div className="text-lg mb-1">{strategy.name}</div>
                {!editMode ? (
                  <div className="text-sm font-normal">
                    Equity: {strategy.equity}% | Debt: {strategy.debt}%
                  </div>
                ) : (
                  <div className="flex gap-2 items-center justify-center">
                    <div className="flex flex-col">
                      <label className="text-xs mb-1">Equity %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={getDisplayEquity(strategy)}
                        onChange={(e) => handleEquityChange(strategy.id, e.target.value)}
                        className="w-16 px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs mb-1">Debt %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={getDisplayDebt(strategy)}
                        onChange={(e) => handleDebtChange(strategy.id, e.target.value)}
                        className="w-16 px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 p-4 font-semibold text-gray-700">
              Risk Profile
            </td>
            {projections.map((strategy) => (
              <td
                key={strategy.id}
                className="border border-gray-300 p-4 text-center font-medium"
              >
                {strategy.riskProfile}
              </td>
            ))}
          </tr>

          <tr className="bg-gray-50">
            <td className="border border-gray-300 p-4 font-semibold text-gray-700">
              Probable Return (p.a.)
            </td>
            {projections.map((strategy) => (
              <td
                key={strategy.id}
                className="border border-gray-300 p-4 text-center font-bold text-green-600"
              >
                {formatNumber(strategy.return)}%
              </td>
            ))}
          </tr>

          <tr className="bg-blue-50">
            <td
              colSpan={projections.length + 1}
              className="border border-gray-300 p-3 text-center font-bold text-blue-900 text-lg"
            >
              Projected Wealth Growth
            </td>
          </tr>

          {projections[0]?.projections.map((projection, index) => (
            <tr key={projection.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 p-4">
                <div className="font-bold text-gray-900">Year {projection.year}</div>
                <div className="text-sm text-gray-600">
                  Total Investment:{' '}
                  {formatCurrency(projection.totalInvestment)}
                </div>
              </td>
              {projections.map((strategy) => (
                <td
                  key={strategy.id}
                  className="border border-gray-300 p-4 text-center"
                >
                  <div className="font-bold text-lg text-gray-900">
                    {formatCurrency(strategy.projections[index].probableAmount)}
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    +
                    {formatNumber(
                      ((strategy.projections[index].probableAmount -
                        strategy.projections[index].totalInvestment) /
                        strategy.projections[index].totalInvestment) *
                        100
                    )}
                    % gain
                  </div>
                </td>
              ))}
            </tr>
          ))}

          <tr className="bg-red-50">
            <td className="border border-gray-300 p-4 font-semibold text-gray-700">
              Prob. of Negative Returns (3Y)
            </td>
            {projections.map((strategy) => (
              <td
                key={strategy.id}
                className="border border-gray-300 p-4 text-center font-medium text-red-600"
              >
                {formatNumber(strategy.probNegative3Y)}%
              </td>
            ))}
          </tr>

          <tr className="bg-blue-100">
            <td className="border border-gray-300 p-4 font-bold text-gray-900">
              Select Strategy
            </td>
            {projections.map((strategy) => (
              <td
                key={strategy.id}
                className="border border-gray-300 p-4 text-center"
              >
                <button
                  onClick={() => onToggleStrategy(strategy.id)}
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    selectedStrategies === strategy.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {selectedStrategies === strategy.id && (
                    <Check className="w-6 h-6" />
                  )}
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ResultTable;
