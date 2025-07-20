// Currency service for fetching USD/INR exchange rates
export interface CurrencyRates {
  currentRate: number;
  sixMonthAverage: number;
  monthlyRates: { [key: string]: number };
}

// Cache for exchange rates to avoid excessive API calls
let rateCache: CurrencyRates | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const getCurrencyRates = async (): Promise<CurrencyRates> => {
  // Return cached data if it's still valid
  if (rateCache && Date.now() - lastFetch < CACHE_DURATION) {
    return rateCache;
  }

  try {
    // Get current date
    const now = new Date();
    const currentDateStr = now.toISOString().split('T')[0];
    
    // Calculate 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0];

    // Fetch historical rates for the past 6 months from Frankfurter API
    const response = await fetch(
      `https://api.frankfurter.app/${sixMonthsAgoStr}..${currentDateStr}?from=USD&to=INR`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract rates
    const rates = data.rates || {};
    const rateValues = Object.values(rates).map((rate: any) => rate.INR).filter(Boolean);
    
    if (rateValues.length === 0) {
      throw new Error('No exchange rate data available');
    }

    // Calculate current rate (most recent)
    const currentRate = rateValues[rateValues.length - 1];
    
    // Calculate 6-month average
    const sixMonthAverage = rateValues.reduce((sum: number, rate: number) => sum + rate, 0) / rateValues.length;

    // Create monthly breakdown
    const monthlyRates: { [key: string]: number } = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Generate sample monthly rates based on historical data
    Object.keys(rates).forEach((date, index) => {
      const rateDate = new Date(date);
      const monthKey = months[rateDate.getMonth()];
      if (!monthlyRates[monthKey] || rateDate > new Date(Object.keys(rates).find(d => {
        const existingDate = new Date(d);
        return months[existingDate.getMonth()] === monthKey;
      }) || '')) {
        monthlyRates[monthKey] = rates[date].INR;
      }
    });

    // Cache the results
    rateCache = {
      currentRate,
      sixMonthAverage,
      monthlyRates
    };
    lastFetch = Date.now();

    return rateCache;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    
    // Return fallback rates if API fails
    const fallbackRates: CurrencyRates = {
      currentRate: 84.5,
      sixMonthAverage: 83.8,
      monthlyRates: {
        'Jan': 83.12,
        'Feb': 83.45,
        'Mar': 83.78,
        'Apr': 84.01,
        'May': 84.23,
        'Jun': 84.45,
        'Jul': 84.50
      }
    };

    rateCache = fallbackRates;
    lastFetch = Date.now();
    
    return fallbackRates;
  }
};

// Helper function to convert INR to USD
export const convertINRToUSD = (amountINR: number, rate: number): number => {
  return amountINR / rate;
};

// Helper function to convert USD to INR
export const convertUSDToINR = (amountUSD: number, rate: number): number => {
  return amountUSD * rate;
};

// Helper function to calculate GST
export const calculateGST = (baseAmount: number, gstRate: number): { gstAmount: number; totalWithGst: number } => {
  const gstAmount = (baseAmount * gstRate) / 100;
  const totalWithGst = baseAmount + gstAmount;
  return { gstAmount, totalWithGst };
};

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string): string => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  } else if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
  return amount.toString();
};