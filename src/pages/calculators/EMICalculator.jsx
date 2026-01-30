import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculateEMI } from '../../utils/calculations';

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(9);

  const result = calculateEMI(loanAmount, years, rate);

  const chartData = [
    { name: 'Principal Amount', value: loanAmount, color: '#73b030' },
    { name: 'Total Interest', value: result.totalInterest, color: '#e29723' }
  ];

  const inputs = (
    <>
      <InputField label="Loan amount" value={loanAmount} onChange={setLoanAmount} min={100000} max={10000000} step={100000} prefix="₹" />
      <InputField label="Interest rate (p.a)" value={rate} onChange={setRate} min={6} max={18} step={0.25} suffix="%" />
      <InputField label="Loan tenure" value={years} onChange={setYears} min={1} max={30} step={1} suffix="Yr" />
    </>
  );

  const results = (
    <>
      <ResultRow label="Loan amount" value={`₹${loanAmount.toLocaleString('en-IN')}`} />
      <ResultRow label="Total interest payable" value={`₹${result.totalInterest.toLocaleString('en-IN')}`} />
      <ResultRow label="Total amount payable" value={`₹${result.totalPayment.toLocaleString('en-IN')}`} />
      <ResultRow label="Monthly EMI" value={`₹${result.monthlyEMI.toLocaleString('en-IN')}`} highlight />
    </>
  );

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto animate-fade-in">
      <SectionTitle title="EMI Calculator" subtitle="Calculate your loan EMI and interest" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        chartData={chartData}
        disclaimer="Plan your loan repayment effectively. Lower tenure means higher EMI but less total interest."
      />
    </section>
  );
};

export default EMICalculator;
