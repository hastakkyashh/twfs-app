import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculateCostOfDelay } from '../../utils/calculations';

const CostOfDelayCalculator = () => {
  const [monthlyInvest, setMonthlyInvest] = useState(5000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(12);
  const [delayMonths, setDelayMonths] = useState(12);

  const result = calculateCostOfDelay(monthlyInvest, years, rate, delayMonths);

  const chartData = [
    { name: 'On-time investment', value: result.onTimeTotal, color: '#73b030' },
    { name: 'Delayed investment', value: result.delayedTotal, color: '#e29723' }
  ];

  const inputs = (
    <>
      <InputField label="Monthly investment" value={monthlyInvest} onChange={setMonthlyInvest} min={500} max={100000} step={500} prefix="₹" />
      <InputField label="Investment period" value={years} onChange={setYears} min={5} max={40} step={1} suffix="Yr" />
      <InputField label="Expected return rate (p.a)" value={rate} onChange={setRate} min={6} max={30} step={0.5} suffix="%" />
      <InputField label="Delay period" value={delayMonths} onChange={setDelayMonths} min={1} max={60} step={1} suffix="Months" />
    </>
  );

  const results = (
    <>
      <ResultRow label="On-time total" value={`₹${result.onTimeTotal.toLocaleString('en-IN')}`} />
      <ResultRow label="Delayed total" value={`₹${result.delayedTotal.toLocaleString('en-IN')}`} />
      <ResultRow label="Cost of delay" value={`₹${result.costOfDelay.toLocaleString('en-IN')}`} highlight />
    </>
  );

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto animate-fade-in">
      <SectionTitle title="Cost of Delay Calculator" subtitle="See the impact of delaying your investments" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        chartData={chartData}
        disclaimer="Every month you delay costs you potential wealth. Start investing today to maximize returns!"
      />
    </section>
  );
};

export default CostOfDelayCalculator;
