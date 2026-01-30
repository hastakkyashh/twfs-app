import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculateSTP } from '../../utils/calculations';

const STPCalculator = () => {
  const [lumpsumAmount, setLumpsumAmount] = useState(1000000);
  const [transferAmount, setTransferAmount] = useState(10000);
  const [years, setYears] = useState(5);
  const [sourceRate, setSourceRate] = useState(6);
  const [targetRate, setTargetRate] = useState(12);

  const result = calculateSTP(lumpsumAmount, transferAmount, years, sourceRate, targetRate);

  const chartData = [
    { name: 'Source Fund Balance', value: result.sourceFinalValue, color: '#73b030' },
    { name: 'Target Fund Value', value: result.targetFinalValue, color: '#e29723' }
  ];

  const inputs = (
    <>
      <InputField label="Lumpsum amount" value={lumpsumAmount} onChange={setLumpsumAmount} min={100000} max={10000000} step={100000} prefix="₹" />
      <InputField label="Monthly transfer" value={transferAmount} onChange={setTransferAmount} min={5000} max={200000} step={5000} prefix="₹" />
      <InputField label="Transfer period" value={years} onChange={setYears} min={1} max={10} step={1} suffix="Yr" />
      <InputField label="Source fund return" value={sourceRate} onChange={setSourceRate} min={4} max={10} step={0.5} suffix="%" />
      <InputField label="Target fund return" value={targetRate} onChange={setTargetRate} min={8} max={18} step={0.5} suffix="%" />
    </>
  );

  const results = (
    <>
      <ResultRow label="Initial investment" value={`₹${lumpsumAmount.toLocaleString('en-IN')}`} />
      <ResultRow label="Source fund balance" value={`₹${result.sourceFinalValue.toLocaleString('en-IN')}`} />
      <ResultRow label="Target fund value" value={`₹${result.targetFinalValue.toLocaleString('en-IN')}`} />
      <ResultRow label="Total portfolio value" value={`₹${result.totalValue.toLocaleString('en-IN')}`} highlight />
    </>
  );

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto animate-fade-in">
      <SectionTitle title="STP Planner" subtitle="Systematic Transfer Plan - Gradually move from debt to equity" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        chartData={chartData}
        disclaimer="STP helps you gradually move from debt funds to equity funds, averaging out market volatility."
      />
    </section>
  );
};

export default STPCalculator;
