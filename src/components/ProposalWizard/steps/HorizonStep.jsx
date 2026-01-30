// STEP 4
// Horizon Step

import React from 'react';
import { Clock, ArrowRight, ArrowLeft } from 'lucide-react';

const HorizonStep = ({ formData, updateFormData, onNext, onPrev }) => {
  const handleSliderChange = (e) => {
    updateFormData('horizon', parseInt(e.target.value));
  };

  const getHorizonLabel = (years) => {
    if (years < 5) return 'Short Term';
    if (years < 10) return 'Medium Term';
    if (years < 20) return 'Long Term';
    return 'Very Long Term';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#ecf4e4' }}>
            <Clock className="w-8 h-8" style={{ color: '#73b030' }} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Investment Horizon
          </h2>
          <p className="text-gray-600">
            How long do you plan to stay invested?
          </p>
        </div>

        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-2" style={{ color: '#73b030' }}>
              {formData.horizon}
            </div>
            <div className="text-2xl text-gray-700 font-semibold">
              Years
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {getHorizonLabel(formData.horizon)}
            </div>
          </div>

          <div className="relative w-full h-6 flex items-center">
            <input 
              type="range" 
              min={3}
              max={30}
              step={1}
              value={formData.horizon} 
              onChange={handleSliderChange}
              className="w-full absolute z-20 opacity-0 cursor-pointer h-full" 
            />
            
            <div className="absolute w-full h-1 bg-gray-200 rounded-full z-0"></div>
            
            <div 
              className="absolute h-1 rounded-full z-10"
              style={{ 
                width: `${((formData.horizon - 3) * 100) / 27}%`,
                backgroundColor: '#73b030'
              }}
            ></div>
            
            <div 
              className="absolute h-6 w-6 bg-white rounded-full z-10 shadow-md transform -translate-x-1/2"
              style={{ 
                left: `${((formData.horizon - 3) * 100) / 27}%`,
                border: '4px solid #73b030'
              }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>3 years</span>
            <span>30 years</span>
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
            onClick={onNext}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-colors"
            style={{ backgroundColor: '#73b030' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#337b1c'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#73b030'}
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorizonStep;
