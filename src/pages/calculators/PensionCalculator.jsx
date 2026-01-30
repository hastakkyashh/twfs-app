import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculatePension } from '../../utils/calculations';

const PensionCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [annuityRate, setAnnuityRate] = useState(6);

  const result = calculatePension(currentAge, retirementAge, monthlyInvestment, expectedReturn, annuityRate);

  const chartData = [
    { name: 'Total Invested', value: result.totalInvested, color: '#e29723' },
    { name: 'Investment Gains', value: result.gains, color: '#73b030' }
  ];

  const inputs = (
    <>
      <InputField label="Current age" value={currentAge} onChange={setCurrentAge} min={18} max={55} step={1} suffix=" Yrs" />
      <InputField label="Retirement age" value={retirementAge} onChange={setRetirementAge} min={50} max={75} step={1} suffix=" Yrs" />
      <InputField label="Monthly investment" value={monthlyInvestment} onChange={setMonthlyInvestment} min={1000} max={100000} step={500} prefix="₹" />
      <InputField label="Expected return (p.a)" value={expectedReturn} onChange={setExpectedReturn} min={6} max={15} step={0.5} suffix="%" />
      <InputField label="Annuity rate (p.a)" value={annuityRate} onChange={setAnnuityRate} min={4} max={10} step={0.5} suffix="%" />
    </>
  );

  const results = (
    <>
      <ResultRow label="Total invested" value={`₹${result.totalInvested.toLocaleString('en-IN')}`} />
      <ResultRow label="Investment gains" value={`₹${result.gains.toLocaleString('en-IN')}`} />
      <ResultRow label="Corpus at retirement" value={`₹${result.corpusAtRetirement.toLocaleString('en-IN')}`} />
      <ResultRow label="Monthly pension" value={`₹${result.monthlyPension.toLocaleString('en-IN')}`} highlight />
    </>
  );

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto animate-fade-in">
      <SectionTitle title="Pension Calculator" subtitle="Plan your retirement with systematic pension investments" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        chartData={chartData}
        disclaimer="Pension calculations are based on assumed rates. Actual returns and pension amounts may vary based on market conditions and plan terms."
      />
    </section>
  );
};

export default PensionCalculator;
