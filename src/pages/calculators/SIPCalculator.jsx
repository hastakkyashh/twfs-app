import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculateSIP } from '../../utils/calculations';

const SIPCalculator = () => {
  const [monthlyInvest, setMonthlyInvest] = useState(5000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const result = calculateSIP(monthlyInvest, years, rate);

  const chartData = [
    { name: 'Invested amount', value: result.invested, color: '#d1e7dd' },
    { name: 'Est. returns', value: result.gain, color: '#73b030' }
  ];

  const inputs = (
    <>
      <InputField
        label="Monthly investment"
        value={monthlyInvest}
        onChange={setMonthlyInvest}
        min={500}
        max={100000}
        step={500}
        prefix="₹"
      />
      <InputField
        label="Expected return rate (p.a)"
        value={rate}
        onChange={setRate}
        min={6}
        max={30}
        step={0.5}
        suffix="%"
      />
      <InputField
        label="Time period"
        value={years}
        onChange={setYears}
        min={1}
        max={40}
        step={1}
        suffix="Yr"
      />
    </>
  );

  const results = (
    <>
      <ResultRow label="Invested amount" value={`₹${result.invested.toLocaleString('en-IN')}`} />
      <ResultRow label="Est. returns" value={`₹${result.gain.toLocaleString('en-IN')}`} />
      <ResultRow label="Total value" value={`₹${result.total.toLocaleString('en-IN')}`} highlight />
    </>
  );

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto animate-fade-in">
      <SectionTitle title="SIP Calculator" subtitle="Systematic Investment Plan Calculator" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        chartData={chartData}
        disclaimer="SIP calculators provide estimates based on assumed rates of return. Actual mutual fund returns may vary depending on market conditions."
      />
    </section>
  );
};

export default SIPCalculator;
