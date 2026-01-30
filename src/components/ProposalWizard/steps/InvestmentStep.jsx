// STEP 5
// Investment Step

import React from 'react';
import { IndianRupee , TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';

const InvestmentStep = ({ formData, updateFormData, onNext, onPrev }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#ecf4e4' }}>
            <IndianRupee className="w-8 h-8" style={{ color: '#73b030' }} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Investment Details
          </h2>
          <p className="text-gray-600">
            Enter your investment amounts and preferences.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lumpsum Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  value={formData.lumpsum || ''}
                  onChange={(e) => updateFormData('lumpsum', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="1000"
                  className="w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-lg"
                  style={{ borderColor: '#e5e7eb' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#73b030'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>
              {formData.lumpsum > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  {formatCurrency(formData.lumpsum)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly SIP Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  value={formData.monthlySIP || ''}
                  onChange={(e) => updateFormData('monthlySIP', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="500"
                  className="w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-lg"
                  style={{ borderColor: '#e5e7eb' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#73b030'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>
              {formData.monthlySIP > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  {formatCurrency(formData.monthlySIP)} per month
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Annual Step-up Percentage (%)
              </label>
              <div className="relative">
                <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="number"
                  value={formData.stepUpPercentage || ''}
                  onChange={(e) => updateFormData('stepUpPercentage', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  max="50"
                  step="1"
                  className="w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-lg"
                  style={{ borderColor: '#e5e7eb' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#73b030'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Your SIP amount will increase by this percentage annually
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-4 mb-8" style={{ backgroundColor: '#ecf4e4', borderColor: '#73b030' }}>
            <h4 className="font-semibold mb-2" style={{ color: '#337b1c' }}>Summary</h4>
            <div className="space-y-1 text-sm" style={{ color: '#337b1c' }}>
              <p>Initial Investment: {formatCurrency(formData.lumpsum)}</p>
              <p>Monthly SIP: {formatCurrency(formData.monthlySIP)}</p>
              <p>Annual Step-up: {formData.stepUpPercentage}%</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onPrev}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: '#73b030' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#337b1c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#73b030'}
            >
              View Results
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentStep;
