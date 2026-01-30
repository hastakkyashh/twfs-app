import { fundDatabase } from '../data/fundsData';

export const getPortfolioAllocation = (strategyId, totalAmount) => {
  const allocations = [];

  if (strategyId === 'conservative') {
    const equityFunds = [
      { id: 'canara-robeco-large-cap', allocation: 10 },
      { id: 'dsp-large-mid-cap', allocation: 10 },
      { id: 'invesco-india-contra', allocation: 10 },
      { id: 'kotak-mid-cap', allocation: 10 },
      { id: 'sbi-large-midcap', allocation: 20 }
    ];

    const debtFunds = [
      { id: 'kotak-arbitrage', allocation: 40 }
    ];

    const allFunds = [...equityFunds, ...debtFunds];

    allFunds.forEach(({ id, allocation }) => {
      const fund = fundDatabase.find(f => f.id === id);
      if (fund) {
        allocations.push({
          fundId: id,
          fundName: fund.name,
          category: fund.category,
          allocationPercentage: allocation,
          amount: (totalAmount * allocation) / 100,
          metrics: fund.metrics,
          risk: fund.risk,
          marketCapSplit: fund.marketCapSplit,
          topSectors: fund.topSectors
        });
      }
    });
  } else if (strategyId === 'growth') {
    const equityFunds = [
      { id: 'dsp-large-mid-cap', allocation: 20 },
      { id: 'invesco-india-contra', allocation: 20 },
      { id: 'kotak-mid-cap', allocation: 20 },
      { id: 'sbi-large-midcap', allocation: 20 }
    ];

    const debtFunds = [
      { id: 'kotak-arbitrage', allocation: 20 }
    ];

    const allFunds = [...equityFunds, ...debtFunds];

    allFunds.forEach(({ id, allocation }) => {
      const fund = fundDatabase.find(f => f.id === id);
      if (fund) {
        allocations.push({
          fundId: id,
          fundName: fund.name,
          category: fund.category,
          allocationPercentage: allocation,
          amount: (totalAmount * allocation) / 100,
          metrics: fund.metrics,
          risk: fund.risk,
          marketCapSplit: fund.marketCapSplit,
          topSectors: fund.topSectors
        });
      }
    });
  } else if (strategyId === 'aggressive') {
    const equityFunds = [
      { id: 'dsp-large-mid-cap', allocation: 25 },
      { id: 'invesco-india-contra', allocation: 25 },
      { id: 'kotak-mid-cap', allocation: 25 },
      { id: 'sbi-large-midcap', allocation: 25 }
    ];

    equityFunds.forEach(({ id, allocation }) => {
      const fund = fundDatabase.find(f => f.id === id);
      if (fund) {
        allocations.push({
          fundId: id,
          fundName: fund.name,
          category: fund.category,
          allocationPercentage: allocation,
          amount: (totalAmount * allocation) / 100,
          metrics: fund.metrics,
          risk: fund.risk,
          marketCapSplit: fund.marketCapSplit,
          topSectors: fund.topSectors
        });
      }
    });
  }

  return allocations;
};

export const getPortfolioSummary = (strategyId, totalAmount) => {
  const allocations = getPortfolioAllocation(strategyId, totalAmount);
  
  const totalEquity = allocations
    .filter(a => a.category !== 'Arbitrage')
    .reduce((sum, a) => sum + a.amount, 0);
  
  const totalDebt = allocations
    .filter(a => a.category === 'Arbitrage')
    .reduce((sum, a) => sum + a.amount, 0);

  const weightedReturn = allocations.reduce((sum, a) => {
    return sum + (a.metrics.return3Y * a.allocationPercentage / 100);
  }, 0);

  return {
    totalAmount,
    totalEquity,
    totalDebt,
    equityPercentage: (totalEquity / totalAmount) * 100,
    debtPercentage: (totalDebt / totalAmount) * 100,
    weightedReturn,
    fundCount: allocations.length,
    allocations
  };
};

export const getAllStrategiesComparison = (totalAmount) => {
  return ['conservative', 'growth', 'aggressive'].map(strategyId => ({
    strategyId,
    summary: getPortfolioSummary(strategyId, totalAmount)
  }));
};
