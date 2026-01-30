import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculateTargetSIP } from '../../utils/calculations';

const SIPPlannerCalculator = () => {
  const [targetAmount, setTargetAmount] = useState(5000000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);

  const result = calculateTargetSIP(targetAmount, years, rate);

  const chartData = [
    { name: 'Invested amount', value: result.invested, color: '#d1e7dd' },
    { name: 'Est. returns', value: result.gain, color: '#73b030' }
  ];

  const inputs = (
    <>
      <InputField label="Target amount" value={targetAmount} onChange={setTargetAmount} min={500000} max={50000000} step={500000} prefix="₹" />
      <InputField label="Time period" value={years} onChange={setYears} min={1} max={40} step={1} suffix="Yr" />
      <InputField label="Expected return rate (p.a)" value={rate} onChange={setRate} min={6} max={30} step={0.5} suffix="%" />
    </>
  );

  const results = (
    <>
      <ResultRow label="Target amount" value={`₹${result.total.toLocaleString('en-IN')}`} />
      <ResultRow label="Total investment" value={`₹${result.invested.toLocaleString('en-IN')}`} />
      <ResultRow label="Required monthly SIP" value={`₹${result.monthlyInvest.toLocaleString('en-IN')}`} highlight />
    </>
  );

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto animate-fade-in">
      <SectionTitle title="SIP Planner" subtitle="Calculate SIP needed to reach your target amount" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        chartData={chartData}
        disclaimer="Set your financial goal and discover the exact monthly SIP needed to achieve it."
      />
    </section>
  );
};

export default SIPPlannerCalculator;
