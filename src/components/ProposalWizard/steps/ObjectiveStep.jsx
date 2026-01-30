// STEP 3
// Objective Step

import React from 'react';
import { Target, TrendingUp, Users, ArrowRight, ArrowLeft } from 'lucide-react';

const ObjectiveStep = ({ formData, updateFormData, onNext, onPrev }) => {
  const objectives = [
    {
      id: 'wealth-building',
      title: 'Wealth Building',
      description: 'Focus on long-term capital appreciation and growth',
      icon: TrendingUp,
      bgColor: '#73b030',
      lightBg: '#ecf4e4',
      iconBg: '#d1e7dd'
    },
    {
      id: 'family-needs',
      title: 'Family Needs',
      description: 'Balanced approach for family goals and security',
      icon: Users,
      bgColor: '#e29723',
      lightBg: '#fef3e2',
      iconBg: '#fde8c8'
    }
  ];

  const handleSelect = (objectiveId) => {
    updateFormData('objective', objectiveId);
  };

  const handleContinue = () => {
    if (formData.objective) {
      onNext();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#ecf4e4' }}>
            <Target className="w-8 h-8" style={{ color: '#73b030' }} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Investment Objective
          </h2>
          <p className="text-gray-600">
            What is the primary goal for this investment?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {objectives.map((objective) => {
            const Icon = objective.icon;
            const isSelected = formData.objective === objective.id;
            
            return (
              <button
                key={objective.id}
                onClick={() => handleSelect(objective.id)}
                className="p-6 rounded-xl border-2 transition-all text-left"
                style={{
                  borderColor: isSelected ? objective.bgColor : '#e5e7eb',
                  backgroundColor: isSelected ? objective.lightBg : 'white',
                  boxShadow: isSelected ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div 
                  className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
                  style={{
                    backgroundColor: isSelected ? objective.iconBg : '#f3f4f6'
                  }}
                >
                  <Icon 
                    className="w-6 h-6"
                    style={{ color: isSelected ? objective.bgColor : '#6b7280' }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {objective.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {objective.description}
                </p>
              </button>
            );
          })}
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
            onClick={handleContinue}
            disabled={!formData.objective}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            style={{
              backgroundColor: formData.objective ? '#73b030' : '#d1d5db'
            }}
            onMouseEnter={(e) => {
              if (formData.objective) e.currentTarget.style.backgroundColor = '#337b1c';
            }}
            onMouseLeave={(e) => {
              if (formData.objective) e.currentTarget.style.backgroundColor = '#73b030';
            }}
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ObjectiveStep;
