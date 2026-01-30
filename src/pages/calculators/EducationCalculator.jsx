import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculateGoalSIP } from '../../utils/calculations';

const EducationCalculator = () => {
  const [currentCost, setCurrentCost] = useState(500000);
  const [years, setYears] = useState(15);
  const [inflationRate, setInflationRate] = useState(8);
  const [returnRate, setReturnRate] = useState(12);

  const result = calculateGoalSIP(currentCost, years, inflationRate, returnRate);

  const chartData = [
    { name: 'Total investment', value: result.invested, color: '#d1e7dd' },
    { name: 'Est. returns', value: result.gain, color: '#73b030' }
  ];

  const inputs = (
    <>
      <InputField label="Current education cost" value={currentCost} onChange={setCurrentCost} min={100000} max={5000000} step={50000} prefix="₹" />
      <InputField label="Years until education" value={years} onChange={setYears} min={1} max={25} step={1} suffix="Yr" />
      <InputField label="Education inflation rate (p.a)" value={inflationRate} onChange={setInflationRate} min={5} max={15} step={0.5} suffix="%" />
      <InputField label="Expected return rate (p.a)" value={returnRate} onChange={setReturnRate} min={8} max={18} step={0.5} suffix="%" />
    </>
  );

  const results = (
    <>
      <ResultRow label="Future education cost" value={`₹${result.futureCost.toLocaleString('en-IN')}`} />
      <ResultRow label="Total investment" value={`₹${result.invested.toLocaleString('en-IN')}`} />
      <ResultRow label="Required monthly SIP" value={`₹${result.monthlySIP.toLocaleString('en-IN')}`} highlight />
    </>
  );

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto animate-fade-in">
      <SectionTitle title="Education Planning Calculator" subtitle="Plan for your child's education expenses" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        chartData={chartData}
        disclaimer="Education costs rise faster than general inflation. Start planning early to secure your child's future."
      />
    </section>
  );
};

export default EducationCalculator;
