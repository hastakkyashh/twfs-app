import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculateStepUpSIP } from '../../utils/calculations';

const SIPStepUpCalculator = () => {
  const [initialInvest, setInitialInvest] = useState(5000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const [stepUpValue, setStepUpValue] = useState(10);
  const [stepUpType, setStepUpType] = useState('percentage');

  const result = calculateStepUpSIP(initialInvest, years, rate, stepUpValue, stepUpType);

  const chartData = [
    { name: 'Invested amount', value: result.invested, color: '#d1e7dd' },
    { name: 'Est. returns', value: result.gain, color: '#73b030' }
  ];

  const inputs = (
    <>
      <InputField label="Initial monthly SIP" value={initialInvest} onChange={setInitialInvest} min={500} max={100000} step={500} prefix="₹" />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Annual step-up type</label>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setStepUpType('percentage')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                stepUpType === 'percentage'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              %
            </button>
            <button
              type="button"
              onClick={() => setStepUpType('amount')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                stepUpType === 'amount'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ₹
            </button>
          </div>
        </div>
        <InputField 
          label={`Annual step-up ${stepUpType === 'percentage' ? '(%)' : '(₹)'}`} 
          value={stepUpValue} 
          onChange={setStepUpValue} 
          min={stepUpType === 'percentage' ? 5 : 100} 
          max={stepUpType === 'percentage' ? 25 : 50000} 
          step={stepUpType === 'percentage' ? 1 : 100} 
          suffix={stepUpType === 'percentage' ? '%' : ''}
          prefix={stepUpType === 'amount' ? '₹' : ''}
        />
      </div>
      <InputField label="Expected return rate (p.a)" value={rate} onChange={setRate} min={6} max={30} step={0.5} suffix="%" />
      <InputField label="Time period" value={years} onChange={setYears} min={5} max={30} step={1} suffix="Yr" />
    </>
  );

  const results = (
    <>
      <ResultRow label="Total investment" value={`₹${result.invested.toLocaleString('en-IN')}`} />
      <ResultRow label="Est. returns" value={`₹${result.gain.toLocaleString('en-IN')}`} />
      <ResultRow label="Total value" value={`₹${result.total.toLocaleString('en-IN')}`} highlight />
    </>
  );

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto animate-fade-in">
      <SectionTitle title="SIP Step-Up Calculator" subtitle="Increase your SIP annually and grow wealth faster" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        chartData={chartData}
        disclaimer="Step-up SIP helps you invest more as your income grows, accelerating wealth creation significantly."
      />
    </section>
  );
};

export default SIPStepUpCalculator;
