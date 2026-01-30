import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculateRetirement } from '../../utils/calculations';

const RetirementCalculator = () => {
  const [currentMonthlyExpense, setCurrentMonthlyExpense] = useState(50000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(80);
  const [inflationRate, setInflationRate] = useState(6);
  const [preRetirementRate, setPreRetirementRate] = useState(12);

  const result = calculateRetirement(
    currentMonthlyExpense,
    currentAge,
    retirementAge,
    lifeExpectancy,
    inflationRate,
    preRetirementRate
  );

  const chartData = [
    { name: 'Total investment', value: result.totalInvested, color: '#d1e7dd' },
    { name: 'Corpus growth', value: result.corpusRequired - result.totalInvested, color: '#73b030' }
  ];

  const inputs = (
    <>
      <InputField label="Current monthly expense" value={currentMonthlyExpense} onChange={setCurrentMonthlyExpense} min={10000} max={200000} step={5000} prefix="₹" />
      <InputField label="Current age" value={currentAge} onChange={setCurrentAge} min={20} max={55} step={1} suffix="Yr" />
      <InputField label="Retirement age" value={retirementAge} onChange={setRetirementAge} min={50} max={70} step={1} suffix="Yr" />
      <InputField label="Life expectancy" value={lifeExpectancy} onChange={setLifeExpectancy} min={65} max={100} step={1} suffix="Yr" />
      <InputField label="Inflation rate (p.a)" value={inflationRate} onChange={setInflationRate} min={4} max={10} step={0.5} suffix="%" />
      <InputField label="Expected return rate (p.a)" value={preRetirementRate} onChange={setPreRetirementRate} min={8} max={18} step={0.5} suffix="%" />
    </>
  );

  const results = (
    <>
      <ResultRow label="Corpus required" value={`₹${result.corpusRequired.toLocaleString('en-IN')}`} />
      <ResultRow label="Total investment" value={`₹${result.totalInvested.toLocaleString('en-IN')}`} />
      <ResultRow label="Required monthly SIP" value={`₹${result.monthlySIP.toLocaleString('en-IN')}`} highlight />
    </>
  );

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto animate-fade-in">
      <SectionTitle title="Retirement Planning Calculator" subtitle="Plan your retirement corpus" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        chartData={chartData}
        disclaimer="Start retirement planning early to build a substantial corpus through the power of compounding."
      />
    </section>
  );
};

export default RetirementCalculator;
