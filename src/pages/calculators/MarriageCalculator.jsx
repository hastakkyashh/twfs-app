import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculateGoalSIP } from '../../utils/calculations';

const MarriageCalculator = () => {
  const [currentCost, setCurrentCost] = useState(1000000);
  const [years, setYears] = useState(10);
  const [inflationRate, setInflationRate] = useState(7);
  const [returnRate, setReturnRate] = useState(12);

  const result = calculateGoalSIP(currentCost, years, inflationRate, returnRate);

  const chartData = [
    { name: 'Total investment', value: result.invested, color: '#d1e7dd' },
    { name: 'Est. returns', value: result.gain, color: '#73b030' }
  ];

  const inputs = (
    <>
      <InputField label="Current marriage cost" value={currentCost} onChange={setCurrentCost} min={200000} max={10000000} step={100000} prefix="₹" />
      <InputField label="Years until marriage" value={years} onChange={setYears} min={1} max={30} step={1} suffix="Yr" />
      <InputField label="Inflation rate (p.a)" value={inflationRate} onChange={setInflationRate} min={5} max={12} step={0.5} suffix="%" />
      <InputField label="Expected return rate (p.a)" value={returnRate} onChange={setReturnRate} min={8} max={18} step={0.5} suffix="%" />
    </>
  );

  const results = (
    <>
      <ResultRow label="Future marriage cost" value={`₹${result.futureCost.toLocaleString('en-IN')}`} />
      <ResultRow label="Total investment" value={`₹${result.invested.toLocaleString('en-IN')}`} />
      <ResultRow label="Required monthly SIP" value={`₹${result.monthlySIP.toLocaleString('en-IN')}`} highlight />
    </>
  );

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto animate-fade-in">
      <SectionTitle title="Marriage Planning Calculator" subtitle="Plan for your child's wedding expenses" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        chartData={chartData}
        disclaimer="Marriage expenses grow with inflation. Plan systematically to celebrate without financial stress."
      />
    </section>
  );
};

export default MarriageCalculator;
