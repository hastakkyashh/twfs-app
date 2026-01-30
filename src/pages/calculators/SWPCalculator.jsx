import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculateSWP } from '../../utils/calculations';

const SWPCalculator = () => {
  const [investedAmount, setInvestedAmount] = useState(5000000);
  const [withdrawalAmount, setWithdrawalAmount] = useState(40000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(10);

  const result = calculateSWP(investedAmount, withdrawalAmount, years, rate);

  const chartData = [
    { name: 'Total Withdrawn', value: result.totalWithdrawn, color: '#e29723' },
    { name: 'Remaining Balance', value: result.finalValue, color: '#73b030' }
  ];

  const inputs = (
    <>
      <InputField label="Invested amount" value={investedAmount} onChange={setInvestedAmount} min={500000} max={20000000} step={500000} prefix="₹" />
      <InputField label="Monthly withdrawal" value={withdrawalAmount} onChange={setWithdrawalAmount} min={5000} max={200000} step={5000} prefix="₹" />
      <InputField label="Withdrawal period" value={years} onChange={setYears} min={5} max={40} step={1} suffix="Yr" />
      <InputField label="Expected return rate (p.a)" value={rate} onChange={setRate} min={6} max={15} step={0.5} suffix="%" />
    </>
  );

  const results = (
    <>
      <ResultRow label="Initial investment" value={`₹${result.invested.toLocaleString('en-IN')}`} />
      <ResultRow label="Total withdrawn" value={`₹${result.totalWithdrawn.toLocaleString('en-IN')}`} />
      <ResultRow label="Remaining balance" value={`₹${result.finalValue.toLocaleString('en-IN')}`} highlight />
    </>
  );

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto animate-fade-in">
      <SectionTitle title="SWP Planner" subtitle="Systematic Withdrawal Plan - Plan your retirement income" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        chartData={chartData}
        disclaimer="SWP provides regular income while your corpus continues to grow. Ideal for retirement planning."
      />
    </section>
  );
};

export default SWPCalculator;
