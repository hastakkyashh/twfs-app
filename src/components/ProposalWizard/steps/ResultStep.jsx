// STEP 6
// Result Step
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye } from 'lucide-react';
import ResultTable from '../components/ResultTable';
import AssetAllocationConfig from '../components/AssetAllocationConfig';
import { calculateProjections, formatCurrency, getDefaultAssetAllocationStrategies, createStrategyFromAllocation } from '../utils/calculations';

const ResultStep = ({ formData, updateFormData, onPrev }) => {
  const [strategies, setStrategies] = useState(formData.customStrategies || getDefaultAssetAllocationStrategies());
  const [showConfig, setShowConfig] = useState(!formData.customStrategies);
  const [projections, setProjections] = useState([]);

  useEffect(() => {
    if (!showConfig && strategies.length > 0) {
      // Ensure formData has required fields
      if (formData.lumpsum !== undefined && formData.monthlySIP !== undefined && formData.stepUpPercentage !== undefined) {
        console.log('Calculating projections with strategies:', strategies);
        console.log('FormData:', formData);
        const calculatedProjections = calculateProjections(formData, strategies);
        console.log('Calculated projections:', calculatedProjections);
        setProjections(calculatedProjections);
      } else {
        console.warn('Missing required formData fields for projection calculation');
      }
    }
  }, [formData, strategies, showConfig]);

  const handleConfigSave = (newStrategies) => {
    const enrichedStrategies = newStrategies.map(strategy => 
      createStrategyFromAllocation(strategy, strategy.equity, strategy.debt)
    );
    setStrategies(enrichedStrategies);
    updateFormData('customStrategies', enrichedStrategies);
    setShowConfig(false);
  };

  const handleToggleStrategy = (strategyId) => {
    updateFormData('selectedStrategies', strategyId);
  };

  const handleSaveAllocations = (tempAllocations) => {
    const updatedStrategies = strategies.map(strategy => {
      if (tempAllocations[strategy.id]) {
        return createStrategyFromAllocation(
          strategy,
          tempAllocations[strategy.id].equity,
          tempAllocations[strategy.id].debt
        );
      }
      return strategy;
    });
    
    setStrategies(updatedStrategies);
    updateFormData('customStrategies', updatedStrategies);
  };

  const handleGenerateProposal = (viewType = 'edit') => {
    const selectedStrategy = strategies.find(s => s.id === formData.selectedStrategies);
    const selectedProjection = projections.find(p => p.id === formData.selectedStrategies);
    
    const proposalData = {
      ...formData,
      selectedStrategyDetails: selectedStrategy,
      selectedProjectionData: selectedProjection
    };
    
    sessionStorage.setItem('proposalFormData', JSON.stringify(proposalData));
    const url = viewType === 'edit' 
      ? `${window.location.origin}/#proposal-edit-form`
      : `${window.location.origin}/#proposal-preview`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Asset Allocation Dashboard
              </h2>
              <p className="text-gray-600">
                {showConfig ? 'Configure your asset allocation strategies' : `Compare different strategies and select the best fit for ${formData.clientName}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Investment Horizon</p>
              <p className="text-2xl font-bold" style={{ color: '#73b030' }}>{formData.horizon} Years</p>
            </div>
          </div>

          {!showConfig && (
            <div className="border rounded-lg p-6 mb-6" style={{ background: 'linear-gradient(to right, #ecf4e4, #fef3e2)', borderColor: '#73b030' }}>
              <h3 className="font-bold text-gray-900 mb-3">Your Investment Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Initial Lumpsum</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(formData.lumpsum)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Monthly SIP</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(formData.monthlySIP)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Annual Step-up</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formData.stepUpPercentage}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {showConfig ? (
          <AssetAllocationConfig
            onConfigSave={handleConfigSave}
            initialStrategies={strategies}
          />
        ) : (
          <>
            <ResultTable
              projections={projections}
              selectedStrategies={formData.selectedStrategies || null}
              onToggleStrategy={handleToggleStrategy}
              onSaveAllocations={handleSaveAllocations}
              formData={formData}
            />

            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Select one strategy above to include in your proposal. 
                You can edit the equity/debt allocation and click "Save & Recalculate" to update projections.
                The projections are based on historical data and assumed returns. Actual results may vary.
              </p>
            </div>
          </>
        )}

        {!showConfig && (
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onPrev}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => setShowConfig(true)}
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Reconfigure Strategies
            </button>
            <button
              onClick={() => handleGenerateProposal('edit')}
              disabled={!formData.selectedStrategies}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              style={{ backgroundColor: formData.selectedStrategies ? '#73b030' : '#d1d5db' }}
              onMouseEnter={(e) => {
                if (formData.selectedStrategies) e.currentTarget.style.backgroundColor = '#337b1c';
              }}
              onMouseLeave={(e) => {
                if (formData.selectedStrategies) e.currentTarget.style.backgroundColor = '#73b030';
              }}
            >
              <Eye className="w-5 h-5" />
              Edit Proposal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultStep;
