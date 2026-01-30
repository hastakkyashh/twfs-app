import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculateSIPTenure } from '../../utils/calculations';

const SIPTenureCalculator = () => {
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [monthlyInvest, setMonthlyInvest] = useState(5000);
  const [rate, setRate] = useState(12);

  const result = calculateSIPTenure(targetAmount, monthlyInvest, rate);

  const chartData = [
    { name: 'Invested amount', value: result.invested, color: '#d1e7dd' },
    { name: 'Est. returns', value: result.total, color: '#73b030' }
  ];

  const inputs = (
    <>
      <InputField label="Target amount" value={targetAmount} onChange={setTargetAmount} min={100000} max={10000000} step={100000} prefix="₹" />
      <InputField label="Monthly investment" value={monthlyInvest} onChange={setMonthlyInvest} min={500} max={100000} step={500} prefix="₹" />
      <InputField label="Expected return rate (p.a)" value={rate} onChange={setRate} min={6} max={30} step={0.5} suffix="%" />
    </>
  );

  const results = (
    <>
      <ResultRow label="Target amount" value={`₹${result.total.toLocaleString('en-IN')}`} />
      <ResultRow label="Total investment" value={`₹${result.invested.toLocaleString('en-IN')}`} />
      <ResultRow label="Time required" value={`${result.years} Years ${result.months} Months`} highlight />
    </>
  );

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto animate-fade-in">
      <SectionTitle title="SIP Tenure Calculator" subtitle="Calculate time needed to reach your goal" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        chartData={chartData}
        disclaimer="Know exactly when you'll reach your financial goal with your current SIP amount."
      />
    </section>
  );
};

export default SIPTenureCalculator;
