// Step-up Strategy Pattern
class PercentageStepUpStrategy {
  calculate(currentSIP, stepUpValue, year) {
    return currentSIP * Math.pow(1 + stepUpValue / 100, year);
  }
}

class AmountStepUpStrategy {
  calculate(initialSIP, stepUpValue, year) {
    return initialSIP + year * stepUpValue;
  }
}

class StepUpStrategyFactory {
  static get(type) {
    return type === "amount"
      ? new AmountStepUpStrategy()
      : new PercentageStepUpStrategy();
  }
}

export const calculateFutureValue = (
  lumpsum,
  monthlySIP,
  stepUpValue,
  stepUpType,
  years,
  annualReturn,
) => {
  const r = annualReturn / 100;
  // Effective monthly rate derived from annual rate (geometric, not nominal).
  // This is the standard used by Zerodha Coin, Groww, and ET Money.
  const i = Math.pow(1 + r, 1 / 12) - 1;

  // Lumpsum compounds annually over the full horizon.
  // Using (1+r)^years (annual basis) is correct and equivalent to (1+i)^(12*years).
  const lumpsumFV = lumpsum * Math.pow(1 + i, 12 * years);

  let sipFV = 0;
  const strategy = StepUpStrategyFactory.get(stepUpType);

  for (let year = 0; year < years; year++) {
    // SIP amount for this 12-month block (steps up each year)
    const currentSIP = strategy.calculate(monthlySIP, stepUpValue, year);

    if (i === 0) {
      // Zero-return edge case: no compounding, just sum of contributions
      sipFV += currentSIP * 12;
    } else {
      // Step 1: FV of this year's 12 SIP installments at the END of this block.
      // Annuity-Due (payment at start of each period) — matches how SIPs are processed.
      // Formula: P * [((1+i)^12 - 1) / i] * (1+i)
      const yearlyBlockFV =
        currentSIP * ((Math.pow(1 + i, 12) - 1) / i) * (1 + i);

      // Step 2: Compound this block's FV to the end of the full horizon.
      // CRITICAL FIX: Use effective monthly rate (i) for remaining months,
      // NOT annual rate (r) for remaining years. Keeps the same rate basis
      // throughout and matches the XIRR model (time-weighted on cash flows).
      const remainingMonths = (years - year - 1) * 12;
      const compoundedToEnd = yearlyBlockFV * Math.pow(1 + i, remainingMonths);
      sipFV += compoundedToEnd;
    }
  }

  return parseFloat((sipFV + lumpsumFV).toFixed(2));
};

export const calculateCAGR = (initialValue, finalValue, years) => {
  if (initialValue <= 0 || years <= 0) return 0;
  return parseFloat(
    ((Math.pow(finalValue / initialValue, 1 / years) - 1) * 100).toFixed(2),
  );
};

export const calculateTotalInvestment = (
  lumpsum,
  monthlySIP,
  stepUpValue,
  stepUpType,
  years,
) => {
  let totalInvestment = lumpsum;
  const strategy = StepUpStrategyFactory.get(stepUpType);

  for (let year = 0; year < years; year++) {
    const currentSIP = strategy.calculate(monthlySIP, stepUpValue, year);
    totalInvestment += currentSIP * 12;
  }

  return parseFloat(totalInvestment.toFixed(2));
};

export const calculateReturnFromAllocation = (equity, debt) => {
  const equityReturn = 12.62;
  const debtReturn = 6.5;
  return parseFloat(
    ((equity / 100) * equityReturn + (debt / 100) * debtReturn).toFixed(2),
  );
};

export const calculateRiskProfile = (equity) => {
  if (equity <= 40) return "Low";
  if (equity <= 60) return "Moderate";
  if (equity <= 80) return "High";
  return "Very High";
};

export const generateYearMilestones = (horizon) => {
  const milestones = [];
  if (horizon >= 3) milestones.push(3);
  if (horizon >= 5) milestones.push(5);
  if (horizon >= 8) milestones.push(8);
  if (horizon >= 10) milestones.push(10);

  if (horizon > 10) {
    let nextMilestone = 15;
    while (nextMilestone < horizon) {
      milestones.push(nextMilestone);
      nextMilestone += 5;
    }
  }
  if (!milestones.includes(horizon)) milestones.push(horizon);
  return milestones;
};

export const calculateProbNegative3Y = (equity) => {
  return parseFloat(((equity / 100) * 9.14).toFixed(2));
};

export const getDefaultAssetAllocationStrategies = () => [
  {
    id: "conservative",
    name: "Conservative",
    equity: 60,
    debt: 40,
    return: 10.22,
    riskProfile: "Moderate",
    probNegative3Y: 2.98,
    probNegative20Y: 0,
    headerColor: "bg-gray-600",
    borderColor: "border-gray-300",
  },
  {
    id: "growth",
    name: "Growth",
    equity: 80,
    debt: 20,
    return: 11.42,
    riskProfile: "High",
    probNegative3Y: 4.87,
    probNegative20Y: 0,
    headerColor: "bg-blue-600",
    borderColor: "border-blue-300",
  },
  {
    id: "aggressive",
    name: "Aggressive",
    equity: 100,
    debt: 0,
    return: 12.62,
    riskProfile: "Very High",
    probNegative3Y: 9.14,
    probNegative20Y: 0,
    headerColor: "bg-orange-600",
    borderColor: "border-orange-300",
  },
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
    probNegative20Y: 0,
  };
};

export const calculateProjections = (formData, customStrategies = null) => {
  const yearMilestones = generateYearMilestones(formData.horizon || 20);
  const strategiesToUse = customStrategies || assetAllocationStrategies;

  return strategiesToUse.map((strategy) => {
    const projections = yearMilestones.map((year) => {
      const probableAmount = calculateFutureValue(
        formData.lumpsum,
        formData.monthlySIP,
        formData.stepUpValue,
        formData.stepUpType,
        year, 
        strategy.return,
      );

      const totalInvestment = calculateTotalInvestment(
        formData.lumpsum,
        formData.monthlySIP,
        formData.stepUpValue,
        formData.stepUpType,
        year, 
      );

      return { year, probableAmount, totalInvestment };
    });
    return { ...strategy, projections };
  });
};

export const formatCurrency = (value) => {
  const formattedNumber = new Intl.NumberFormat("en-IN", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value);
  return `Rs. ${formattedNumber}`;
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
};
