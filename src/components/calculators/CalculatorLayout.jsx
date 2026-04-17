import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '../ui';
import { AlertCircle } from 'lucide-react';

const CalculatorLayout = ({ 
  inputs, 
  results, 
  showChart = true,
  chartData = [],
  disclaimer = "Calculators provide estimates based on assumed rates of return. Actual returns may vary."
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/contact');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left: Inputs */}
        <div className="space-y-6">
          <div className="space-y-6">
            {inputs}
          </div>
          
          {/* Disclaimer */}
          {disclaimer && (
            <div className="mt-8 p-4 bg-light-cream/50 border-l-4 border-primary-green rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 leading-relaxed">{disclaimer}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Chart & Results */}
        <div className="flex flex-col">
          {/* Pie Chart */}
          {showChart && chartData.length > 0 && (
            <div className="mb-6 bg-slate-50 rounded-xl p-4">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    iconType="circle"
                    formatter={(value, entry) => (
                      <span className="text-sm text-slate-700 font-medium">{entry.payload.name}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Results */}
          <div className="space-y-4 flex-1">
            {results}
            <Button 
              onClick={handleNavigate}
              className="w-full mt-6 py-4 px-6 font-bold text-base text-white active:scale-[0.98]"
              style={{ 
                backgroundColor: 'var(--color-primary-green)',
                border: 'none',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                transition: 'var(--transition-base)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-dark-green)';
                e.target.style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary-green)';
                e.target.style.boxShadow = 'var(--shadow-lg)';
              }}
            >
              INVEST NOW 
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InputField = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step, 
  suffix = '',
  prefix = ''
}) => {
  // Handle typing or slider movement
  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val === '' ? '' : Number(val));
  };

  // Enforce min/max bounds when the user clicks away from the input field
  const handleBlur = () => {
    if (value === '' || value < min) {
      onChange(min);
    } else if (value > max) {
      onChange(max);
    }
  };

  // Safe calculations for the custom visual slider elements
  const safeValue = value === '' ? min : Number(value);
  const percentage = ((safeValue - min) * 100) / (max - min);
  const clampedPercentage = Math.max(0, Math.min(100, percentage)); // Prevents UI break if manually typed over max

  return (
    <div className="mb-8">
      {/* Label and Editable Value Row */}
      <div className="flex justify-between items-center mb-4">
        <label className="text-slate-700 font-medium text-lg">{label}</label>
        <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg text-emerald-500 font-bold text-xl min-w-[120px] focus-within:ring-2 focus-within:ring-emerald-400 transition-shadow">
          {prefix && <span className="mr-1">{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            min={min}
            max={max}
            step={step}
            className="w-full bg-transparent outline-none text-right appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && <span className="ml-1">{suffix}</span>}
        </div>
      </div>

      {/* Custom Range Slider */}
      <div className="relative w-full h-6 flex items-center group">
        <input 
          type="range" 
          min={min}
          max={max}
          step={step}
          value={safeValue} 
          onChange={handleInputChange}
          className="w-full absolute z-20 opacity-0 cursor-pointer h-full" 
        />
        
        {/* Visual Track */}
        <div className="absolute w-full h-1 bg-gray-200 rounded-full z-0"></div>
        
        {/* Visual Progress Fill */}
        <div 
          className="absolute h-1 bg-emerald-500 rounded-full z-10 transition-all duration-75"
          style={{ width: `${clampedPercentage}%` }}
        ></div>
        
        {/* Visual Thumb (Circle) */}
        <div 
          className="absolute h-6 w-6 bg-white border-4 border-emerald-500 rounded-full z-10 shadow-md transform -translate-x-1/2 group-hover:scale-110 transition-transform duration-150"
          style={{ left: `${clampedPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export const ResultRow = ({ label, value, highlight = false }) => {
  if (highlight) {
    return (
      <div 
        className="flex justify-between items-center py-5 px-5 mt-4"
        style={{ 
          background: 'linear-gradient(135deg, var(--color-light-cream) 0%, var(--color-white) 100%)',
          border: '2px solid var(--color-primary-green)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <span className="text-slate-800 font-semibold text-base">{label}</span>
        <span className="text-3xl font-extrabold" style={{ color: 'var(--color-primary-green)' }}>{value}</span>
      </div>
    );
  }
  
  return (
    <div className="flex justify-between items-center py-4 border-b border-slate-200">
      <span className="text-slate-600 font-medium text-sm">{label}</span>
      <span className="text-xl font-bold text-slate-900">{value}</span>
    </div>
  );
};

export default CalculatorLayout;