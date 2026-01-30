import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculateLumpsum } from '../../utils/calculations';

const LumpsumCalculator = () => {
  const [amount, setAmount] = useState(100000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const result = calculateLumpsum(amount, years, rate);

  const chartData = [
    { name: 'Invested amount', value: result.invested, color: '#d1e7dd' },
    { name: 'Est. returns', value: result.gain, color: '#73b030' }
  ];

  const inputs = (
    <>
      <InputField
        label="Total investment"
        value={amount}
        onChange={setAmount}
        min={10000}
        max={10000000}
        step={10000}
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
      <SectionTitle title="Lumpsum Calculator" subtitle="One-time Investment Calculator" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        chartData={chartData}
        disclaimer="Lumpsum investments are ideal for those with surplus funds. Returns are subject to market risks and may vary."
      />
    </section>
  );
};

export default LumpsumCalculator;
