// STEP 1
// Landing Step
import React from 'react';
import { TrendingUp, Shield, Target } from 'lucide-react';

const LandingStep = ({ onNext }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: '#ecf4e4' }}>
            <TrendingUp className="w-10 h-10" style={{ color: '#73b030' }} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Investment Proposal Wizard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a personalized investment strategy in just a few steps. 
            We'll help you build a portfolio tailored to your financial goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#ecf4e4' }}>
            <Target className="w-8 h-8 mx-auto mb-3" style={{ color: '#73b030' }} />
            <h3 className="font-semibold text-gray-900 mb-2">Define Goals</h3>
            <p className="text-sm text-gray-600">
              Set your investment objectives and timeline
            </p>
          </div>
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#fef3e2' }}>
            <Shield className="w-8 h-8 mx-auto mb-3" style={{ color: '#e29723' }} />
            <h3 className="font-semibold text-gray-900 mb-2">Risk Analysis</h3>
            <p className="text-sm text-gray-600">
              Compare different asset allocation strategies
            </p>
          </div>
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#d1e7dd' }}>
            <TrendingUp className="w-8 h-8 mx-auto mb-3" style={{ color: '#337b1c' }} />
            <h3 className="font-semibold text-gray-900 mb-2">Get Results</h3>
            <p className="text-sm text-gray-600">
              View projected returns and generate your proposal
            </p>
          </div>
        </div>

        <button
          onClick={onNext}
          className="px-8 py-4 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#73b030' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#337b1c'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#73b030'}
        >
          Start Your Proposal
        </button>
      </div>
    </div>
  );
};

export default LandingStep;
