export const calculateFutureValue = (lumpsum, monthlySIP, stepUpPercentage, years, annualReturn) => {
  const monthlyReturn = annualReturn / 12 / 100;
  const months = years * 12;
  
  // CAGR-based compounding for lumpsum
  let lumpsumFV = lumpsum * Math.pow(1 + annualReturn / 100, years);
  
  // CAGR-based compounding for SIP with step-up
  let sipFV = 0;
  let currentSIP = monthlySIP;
  
  for (let year = 0; year < years; year++) {
    const monthsInThisYear = Math.min(12, months - (year * 12));
    
    for (let month = 0; month < monthsInThisYear; month++) {
      const remainingMonths = months - (year * 12 + month);
      // Using CAGR: FV = PV * (1 + r)^n where r is monthly rate
      const futureValueOfThisPayment = currentSIP * Math.pow(1 + monthlyReturn, remainingMonths);
      sipFV += futureValueOfThisPayment;
    }
    
    // Apply step-up at year end
    currentSIP = currentSIP * (1 + stepUpPercentage / 100);
  }
  
  return parseFloat((lumpsumFV + sipFV).toFixed(2));
};

// Calculate CAGR from initial and final values
export const calculateCAGR = (initialValue, finalValue, years) => {
  if (initialValue <= 0 || years <= 0) return 0;
  return parseFloat(((Math.pow(finalValue / initialValue, 1 / years) - 1) * 100).toFixed(2));
};

export const calculateTotalInvestment = (lumpsum, monthlySIP, stepUpPercentage, years) => {
  let totalInvestment = lumpsum;
  let currentSIP = monthlySIP;
  
  for (let year = 0; year < years; year++) {
    totalInvestment += currentSIP * 12;
    currentSIP = currentSIP * (1 + stepUpPercentage / 100);
  }
  
  return parseFloat(totalInvestment.toFixed(2));
};

export const calculateReturnFromAllocation = (equity, debt) => {
  const equityReturn = 12.62;
  const debtReturn = 6.5;
  return parseFloat(((equity / 100) * equityReturn + (debt / 100) * debtReturn).toFixed(2));
};

export const calculateRiskProfile = (equity) => {
  if (equity <= 40) return 'Low';
  if (equity <= 60) return 'Moderate';
  if (equity <= 80) return 'High';
  return 'Very High';
};

// Generate dynamic year milestones based on user's investment horizon
export const generateYearMilestones = (horizon) => {
  const milestones = [];
  
  // Always include early milestones if within horizon
  if (horizon >= 3) milestones.push(3);
  if (horizon >= 5) milestones.push(5);
  if (horizon >= 8) milestones.push(8);
  if (horizon >= 10) milestones.push(10);
  
  // After year 10, add milestones in 5-year increments
  if (horizon > 10) {
    let nextMilestone = 15;
    while (nextMilestone < horizon) {
      milestones.push(nextMilestone);
      nextMilestone += 5;
    }
  }
  
  // Always include the final horizon year if not already included
  if (!milestones.includes(horizon)) {
    milestones.push(horizon);
  }
  
  return milestones;
};

export const calculateProbNegative3Y = (equity) => {
  return parseFloat(((equity / 100) * 9.14).toFixed(2));
};

export const getDefaultAssetAllocationStrategies = () => [
  {
    id: 'conservative',
    name: 'Conservative',
    equity: 60,
    debt: 40,
    return: 10.22,
    riskProfile: 'Moderate',
    probNegative3Y: 2.98,
    probNegative20Y: 0,
    headerColor: 'bg-gray-600',
    borderColor: 'border-gray-300'
  },
  {
    id: 'growth',
    name: 'Growth',
    equity: 80,
    debt: 20,
    return: 11.42,
    riskProfile: 'High',
    probNegative3Y: 4.87,
    probNegative20Y: 0,
    headerColor: 'bg-blue-600',
    borderColor: 'border-blue-300'
  },
  {
    id: 'aggressive',
    name: 'Aggressive',
    equity: 100,
    debt: 0,
    return: 12.62,
    riskProfile: 'Very High',
    probNegative3Y: 9.14,
    probNegative20Y: 0,
    headerColor: 'bg-orange-600',
    borderColor: 'border-orange-300'
  }
];

export const assetAllocationStrategies = getDefaultAssetAllocationStrategies();

export const createStrategyFromAllocation = (baseStrategy, equity, debt) => {
  return {
    ...baseStrategy,
    equity,
    debt,
    return: calculateReturnFromAllocation(equity, debt),
    riskProfile: calculateRiskProfile(equity),
    probNegative3Y: calculateProbNegative3Y(equity),
    probNegative20Y: 0
  };
};

export const calculateProjections = (formData, customStrategies = null) => {
  const yearMilestones = generateYearMilestones(formData.horizon || 20);
  const strategiesToUse = customStrategies || assetAllocationStrategies;
  
  return strategiesToUse.map(strategy => {
    const projections = yearMilestones.map(year => {
      const probableAmount = calculateFutureValue(
        formData.lumpsum,
        formData.monthlySIP,
        formData.stepUpPercentage,
        year,
        strategy.return
      );
      
      const totalInvestment = calculateTotalInvestment(
        formData.lumpsum,
        formData.monthlySIP,
        formData.stepUpPercentage,
        year
      );
      
      return {
        year,
        probableAmount,
        totalInvestment
      };
    });
    
    return {
      ...strategy,
      projections
    };
  });
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2
  }).format(value);
};
