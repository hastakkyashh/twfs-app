export const calculateSIP = (monthlyInvest, years, rate) => {
  const rateD = rate / 100;
  const i = parseFloat(((Math.pow(1 + rateD, 1/12)) - 1).toFixed(4));
  const n = years * 12;
  const fv = monthlyInvest * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const invested = monthlyInvest * n;
  return {
    total: Math.round(fv),
    invested: Math.round(invested),
    gain: Math.round(fv - invested)
  };
};

export const calculateLumpsum = (investedAmount, years, rate) => {
  const i = rate / 100;
  // Formula: P * (1 + r)^n
  const fv = investedAmount * Math.pow(1 + i, years);
  
  return {
    total: Math.round(fv),
    invested: Math.round(investedAmount),
    gain: Math.round(fv - investedAmount)
  };
};

export const calculateTargetSIP = (targetAmount, years, rate) => {
  const rateD = rate / 100;
  const i = (Math.pow(1 + rateD, 1/12)) - 1;  const n = years * 12;
  // Formula: SIP = FV / [ ( (1+i)^n - 1 ) / i ] * (1+i)
  const monthlyInvest = targetAmount / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  
  return {
    monthlyInvest: Math.round(monthlyInvest),
    total: Math.round(targetAmount),
    invested: Math.round(monthlyInvest * n),
    gain: Math.round(targetAmount - (monthlyInvest * n))
  };
};

export const calculateSIPTenure = (targetAmount, monthlyInvest, rate) => {
  const i = rate / 12 / 100;
  
  // Formula derived from FV of Annuity
  // n = ln( (FV * i) / (P * (1+i)) + 1 ) / ln(1+i)
  const numerator = Math.log(((targetAmount * i) / (monthlyInvest * (1 + i))) + 1);
  const denominator = Math.log(1 + i);
  const months = numerator / denominator;
  
  return {
    months: Math.round(months),
    years: (months / 12).toFixed(1),
    invested: Math.round(monthlyInvest * months),
    total: Math.round(targetAmount)
  };
};

export const calculateStepUpSIP = (initialInvest, years, rate, stepUpPercentage) => {
  let currentInvest = initialInvest;
  let totalValue = 0;
  let totalInvested = 0;
  const monthlyRate = rate / 12 / 100;

  for (let y = 1; y <= years; y++) {
    // For each year (12 months)
    // FV for this year's specific SIP series
    // We calculate the FV of this year's contribution at the END of the total tenure
    // Actually, easier approach: Iterative compounding
    for (let m = 1; m <= 12; m++) {
        totalValue = (totalValue + currentInvest) * (1 + monthlyRate);
        totalInvested += currentInvest;
    }
    // Increase SIP for next year
    currentInvest = currentInvest * (1 + stepUpPercentage / 100);
  }

  return {
    total: Math.round(totalValue),
    invested: Math.round(totalInvested),
    gain: Math.round(totalValue - totalInvested)
  };
};


export const calculateCostOfDelay = (monthlyInvest, years, rate, delayMonths) => {
  // Scenario 1: Start Now
  const i = rate / 12 / 100;
  const n1 = years * 12;
  const fvNow = monthlyInvest * ((Math.pow(1 + i, n1) - 1) / i) * (1 + i);

  // Scenario 2: Start Late (Investment duration reduces)
  const n2 = n1 - delayMonths;
  const fvLater = monthlyInvest * ((Math.pow(1 + i, n2) - 1) / i) * (1 + i);

  return {
    onTimeTotal: Math.round(fvNow),
    delayedTotal: Math.round(fvLater),
    costOfDelay: Math.round(fvNow - fvLater)
  };
};

export const calculateGoalSIP = (currentCost, years, inflationRate, returnRate) => {
  // 1. Calculate Future Cost of the Goal
  const fvCost = currentCost * Math.pow(1 + (inflationRate / 100), years);

  // 2. Calculate SIP required to achieve that Future Cost
  const i = returnRate / 12 / 100;
  const n = years * 12;
  const monthlyInvest = fvCost / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));

  const totalInvested = Math.round(monthlyInvest * n);
  
  return {
    futureCost: Math.round(fvCost),
    monthlySIP: Math.round(monthlyInvest),
    invested: totalInvested,
    gain: Math.round(fvCost - totalInvested)
  };
};

export const calculateRetirement = (
  currentMonthlyExpense,
  currentAge,
  retirementAge,
  lifeExpectancy,
  inflationRate,
  preRetirementRate
) => {
  const yearsToRetire = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  
  // 1. Calculate Monthly Expense at time of Retirement
  const expenseAtRetirement = currentMonthlyExpense * Math.pow(1 + inflationRate / 100, yearsToRetire);
  
  // 2. Calculate Corpus Required (Simple Multiplier method for estimate)
  // Assuming a safe withdrawal structure or purely creating a corpus that covers expenses
  // A standard rule of thumb is (Annual Expense * Years in Retirement) 
  // But a more accurate financial planning approach calculates the PV of the annuity needed.
  // We will use a simplified Corpus calculation: Expense * 12 * Years (ignoring post-retirement growth offset by inflation for safety)
  const requiredCorpus = (expenseAtRetirement * 12) * yearsInRetirement;

  // 3. SIP Needed
  const i = preRetirementRate / 12 / 100;
  const n = yearsToRetire * 12;
  const monthlyInvest = requiredCorpus / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));

  const totalInvested = Math.round(monthlyInvest * n);
  
  return {
    expenseAtRetirement: Math.round(expenseAtRetirement),
    corpusRequired: Math.round(requiredCorpus),
    monthlySIP: Math.round(monthlyInvest),
    totalInvested: totalInvested,
    yearsToRetire
  };
};

export const calculateEMI = (loanAmount, years, rate) => {
  const r = rate / 12 / 100; // Monthly interest rate
  const n = years * 12;      // Total months
  
  // Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
  const emi = loanAmount * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
  const totalPayment = emi * n;
  
  return {
    monthlyEMI: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalPayment - loanAmount)
  };
};

export const calculateSWP = (investedAmount, withdrawalAmount, years, rate) => {
  let balance = investedAmount;
  let totalWithdrawn = 0;
  const monthlyRate = rate / 12 / 100;
  const months = years * 12;

  for (let i = 0; i < months; i++) {
    // 1. Add Growth
    balance = balance + (balance * monthlyRate);
    // 2. Subtract Withdrawal
    balance = balance - withdrawalAmount;
    
    totalWithdrawn += withdrawalAmount;
    
    // If money runs out
    if (balance < 0) {
        balance = 0;
        break;
    }
  }

  return {
    totalWithdrawn: Math.round(totalWithdrawn),
    finalValue: Math.round(balance), // Amount left after tenure
    invested: investedAmount
  };
};

export const calculateSTP = (
  lumpsumAmount, 
  transferAmount, 
  years, 
  sourceRate, // Debt fund return (e.g., 6%)
  targetRate  // Equity fund return (e.g., 12%)
) => {
  let sourceBalance = lumpsumAmount;
  let targetBalance = 0;
  const months = years * 12;
  
  const monthlySourceRate = sourceRate / 12 / 100;
  const monthlyTargetRate = targetRate / 12 / 100;

  for (let i = 0; i < months; i++) {
    sourceBalance += sourceBalance * monthlySourceRate;
    sourceBalance -= transferAmount;
    if (sourceBalance < 0) sourceBalance = 0;

    targetBalance += transferAmount;
    targetBalance += targetBalance * monthlyTargetRate;
  }

  return {
    sourceFinalValue: Math.round(sourceBalance),
    targetFinalValue: Math.round(targetBalance),
    totalTransferred: transferAmount * months,
    totalValue: Math.round(sourceBalance + targetBalance)
  };
};

export const calculateHumanLifeValue = (
  age,
  retirementAge,
  annualIncome,
  inflationRate
) => {
  const remainingWorkingYears = retirementAge - age;  

  const humanLifeValue = annualIncome * remainingWorkingYears;
  
  return {
    humanLifeValue: Math.round(humanLifeValue),
    remainingWorkingYears,  
    inflationRate
  };
};

export const calculatePension = (
  currentAge,
  retirementAge,
  monthlyInvestment,
  expectedReturn,
  annuityRate
) => {
  const yearsToRetirement = retirementAge - currentAge;
  
  // Calculate corpus at retirement using SIP formula
  const i = expectedReturn / 12 / 100;
  const n = yearsToRetirement * 12;
  const corpusAtRetirement = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  
  const totalInvested = monthlyInvestment * n;
  const gains = corpusAtRetirement - totalInvested;
  
  // Calculate monthly pension from annuity
  // Annuity rate is annual, so monthly pension = corpus * (annuity rate / 12 / 100)
  const monthlyPension = corpusAtRetirement * (annuityRate / 12 / 100);
  const annualPension = monthlyPension * 12;
  
  return {
    corpusAtRetirement: Math.round(corpusAtRetirement),
    totalInvested: Math.round(totalInvested),
    gains: Math.round(gains),
    monthlyPension: Math.round(monthlyPension),
    annualPension: Math.round(annualPension)
  };
};

export const calculateBMI = (weight, height) => {
  // BMI = weight (kg) / (height (m))^2
  const heightInMeters = height / 100; // Convert cm to meters
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category = '';
  let healthStatus = '';
  let recommendation = '';
  let color = '';
  
  if (bmi < 18.5) {
    category = 'Underweight';
    healthStatus = 'Below normal weight';
    recommendation = 'Consider consulting a nutritionist to gain healthy weight';
    color = '#3b82f6';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal';
    healthStatus = 'Healthy weight range';
    recommendation = 'Maintain your current lifestyle and healthy habits';
    color = '#22c55e';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    healthStatus = 'Above normal weight';
    recommendation = 'Consider regular exercise and balanced diet';
    color = '#f97316';
  } else {
    category = 'Obese';
    healthStatus = 'Significantly above normal weight';
    recommendation = 'Consult a healthcare professional for a weight management plan';
    color = '#ef4444';
  }
  
  // Calculate needle angle for 180-degree gauge (0° = left, 180° = right)
  // BMI range: 10 to 40 mapped to 0° to 180°
  const minBMI = 10;
  const maxBMI = 40;
  const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi));
  const needleAngle = ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 180;
  
  return {
    bmi: bmi.toFixed(1),
    bmiValue: bmi,
    category,
    healthStatus,
    recommendation,
    color,
    needleAngle
  };
};

