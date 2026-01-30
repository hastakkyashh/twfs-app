import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculateHumanLifeValue } from '../../utils/calculations';

const HumanLifeValueCalculator = () => {
  const [age, setAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [inflationRate, setInflationRate] = useState(6);

  const result = calculateHumanLifeValue(age, retirementAge, annualIncome, inflationRate);

  const chartData = [
    { name: 'Human Life Value', value: result.humanLifeValue, color: '#73b030' },
      // { name: 'time period', value: result.remainingWorkingYears, color: '#e29723' }
  ];

  const inputs = (
    <>
      <InputField label="Current age" value={age} onChange={setAge} min={18} max={85} step={1} suffix=" Yrs" />
      <InputField label="Retirement age" value={retirementAge} onChange={setRetirementAge} min={50} max={85} step={1} suffix=" Yrs" />
      <InputField label="Annual income" value={annualIncome} onChange={setAnnualIncome} min={100000} max={10000000} step={50000} prefix="₹" />
      {/* <InputField label="Inflation rate (p.a)" value={inflationRate} onChange={setInflationRate} min={0} max={12} step={0.5} suffix="%" /> */}
    </>
  );

  const results = (
    <>
      <ResultRow label="Remaining working years" value={`${result.remainingWorkingYears} years`} />
      <ResultRow label="Human life value (PV)" value={`₹${result.humanLifeValue.toLocaleString('en-IN')}`} highlight />
    </>
  );

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto animate-fade-in">
      <SectionTitle title="Human Life Value Calculator" subtitle="Calculate the ideal life insurance coverage based on your future earnings" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        chartData={chartData}
        disclaimer="Human Life Value represents the present value of your future earnings. Ensure adequate coverage to protect your family's financial future."
      />
    </section>
  );
};

export default HumanLifeValueCalculator;
