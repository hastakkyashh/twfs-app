/**
 * Frontend Funds Service
 * Direct API calls to mfapi.in from frontend
 * Includes caching and CAGR calculation logic
 */

const MFAPI_BASE_URL = 'https://api.mfapi.in';

// In-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached data if available and not expired
 */
const getCached = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

/**
 * Set data in cache with timestamp
 */
const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

/**
 * Clean up expired cache entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, CACHE_DURATION);

/**
 * Search for mutual funds
 * @param {string} query - Search query (minimum 2 characters)
 * @returns {Promise<{funds: Array, cached: boolean}>}
 */
export const searchFunds = async (query) => {
  try {
    if (!query || query.length < 2) {
      throw new Error('Query must be at least 2 characters');
    }

    const cacheKey = `search:${query.toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return { funds: cached, cached: true };
    }

    console.log(`Searching mfapi.in for: "${query}"`);
    
    const response = await fetch(
      `${MFAPI_BASE_URL}/mf/search?q=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    
    const funds = await response.json();
    
    if (!Array.isArray(funds)) {
      console.log('Invalid response from mfapi.in');
      return { funds: [], cached: false };
    }

    const formattedFunds = funds.map(fund => ({
      schemeCode: fund.schemeCode,
      schemeName: fund.schemeName,
      symbol: fund.schemeCode.toString(),
      name: fund.schemeName
    }));

    console.log(`Found ${formattedFunds.length} mutual funds`);
    
    setCache(cacheKey, formattedFunds);
    return { funds: formattedFunds, cached: false };
  } catch (error) {
    console.error('Search error:', error);
    throw new Error(error.message || 'Failed to search funds');
  }
};

/**
 * Calculate returns for different time periods
 * @param {Array} data - Historical NAV data
 * @returns {object} Returns for different periods
 */
const calculateReturns = (data) => {
  const parseDate = (dateStr) => {
    const parts = dateStr.split('-');
    return new Date(parts[2], parts[1] - 1, parts[0]);
  };

  const getNavForDate = (targetDate) => {
    for (let i = 0; i < data.length; i++) {
      const currentDate = parseDate(data[i].date);
      if (currentDate <= targetDate) {
        return {
          nav: parseFloat(data[i].nav),
          actualDateObj: currentDate
        };
      }
    }
    return null;
  };

  const latestEntry = data[0];
  const latestDate = parseDate(latestEntry.date);
  const latestNav = parseFloat(latestEntry.nav);

  const durations = [
    { label: '3M', years: 0, months: 3 },
    { label: '6M', years: 0, months: 6 },
    { label: '1Y', years: 1, months: 0 },
    { label: '3Y', years: 3, months: 0 },
    { label: '5Y', years: 5, months: 0 },
    { label: '10Y', years: 10, months: 0 },
  ];

  const results = {};

  durations.forEach(dur => {
    const targetDate = new Date(latestDate);
    targetDate.setFullYear(targetDate.getFullYear() - dur.years);
    targetDate.setMonth(targetDate.getMonth() - dur.months);

    const pastData = getNavForDate(targetDate);

    if (pastData) {
      const isLessThanOneYear = (dur.years === 0 && dur.months < 12);

      if (isLessThanOneYear) {
        // Absolute return for periods < 1 year
        const returnPercentage = ((latestNav - pastData.nav) / pastData.nav) * 100;
        results[dur.label] = parseFloat(returnPercentage.toFixed(2));
      } else {
        // CAGR for periods >= 1 year
        const diffTime = Math.abs(latestDate - pastData.actualDateObj);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const exactYears = diffDays / 365;
        const cagr = (Math.pow((latestNav / pastData.nav), (1 / exactYears)) - 1) * 100;
        results[dur.label] = parseFloat(cagr.toFixed(2));
      }
    } else {
      results[dur.label] = null;
    }
  });

  // Since Inception CAGR
  const inceptionEntry = data[data.length - 1];
  const inceptionNav = parseFloat(inceptionEntry.nav);
  const inceptionDate = parseDate(inceptionEntry.date);
  
  const diffTimeIncep = Math.abs(latestDate - inceptionDate);
  const diffDaysIncep = Math.ceil(diffTimeIncep / (1000 * 60 * 60 * 24));
  const yearsIncep = diffDaysIncep / 365.25;

  const inceptionCAGR = (Math.pow((latestNav / inceptionNav), (1 / yearsIncep)) - 1) * 100;
  results['Since Inception'] = parseFloat(inceptionCAGR.toFixed(2));

  console.log('Calculated returns:', results);
  return results;
};

/**
 * Get detailed fund information
 * @param {string} symbol - Fund scheme code
 * @returns {Promise<{fund: object, cached: boolean}>}
 */
export const getFundDetails = async (symbol) => {
  try {
    const cacheKey = `details:${symbol}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return { fund: cached, cached: true };
    }

    console.log(`Fetching fund details from mfapi.in for scheme code: ${symbol}`);
    
    const response = await fetch(`${MFAPI_BASE_URL}/mf/${symbol}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Fund not found');
      }
      throw new Error(`API returned status ${response.status}`);
    }
    
    const mfData = await response.json();
    
    if (!mfData || !mfData.data || mfData.data.length === 0) {
      throw new Error('No data available for this fund');
    }

    const returns = calculateReturns(mfData.data);
    const latestNav = parseFloat(mfData.data[0].nav);

    const fundData = {
      symbol: symbol,
      schemeCode: mfData.meta.scheme_code,
      name: mfData.meta.scheme_name,
      schemeName: mfData.meta.scheme_name,
      fundHouse: mfData.meta.fund_house,
      schemeType: mfData.meta.scheme_type,
      schemeCategory: mfData.meta.scheme_category,
      
      nav: latestNav,
      navDate: mfData.data[0].date,
      
      return3M: returns['3M'],
      return6M: returns['6M'],
      return1Y: returns['1Y'],
      return3Y: returns['3Y'],
      return5Y: returns['5Y'],
      return10Y: returns['10Y'],
      returnSinceInception: returns['Since Inception'],
      
      category: mfData.meta.scheme_category || 'N/A',
      aum: 'N/A',
      expenseRatio: 'N/A',
      risk: 'Medium',
      topSector: 'N/A',
      currentPrice: latestNav,
      currency: 'INR',
    };

    setCache(cacheKey, fundData);
    return { fund: fundData, cached: false };

  } catch (error) {
    console.error('Fund details error:', error);
    throw new Error(error.message || 'Failed to fetch fund details');
  }
};

/**
 * Clear all cached data
 * @returns {number} Number of items cleared
 */
export const clearCache = () => {
  const size = cache.size;
  cache.clear();
  console.log(`Cache cleared: ${size} items removed`);
  return size;
};

/**
 * Get cache statistics
 * @returns {object} Cache stats
 */
export const getCacheStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
};
