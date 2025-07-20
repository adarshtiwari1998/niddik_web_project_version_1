import { db } from "@db";

export interface CurrencyRates {
  [key: string]: number;
}

export interface ExchangeRateResponse {
  data: CurrencyRates;
  meta: {
    last_updated_at: string;
  };
}

export interface FreeCurrencyAPIResponse {
  data: {
    [key: string]: number;
  };
}

export interface HistoricalRatesResponse {
  data: {
    [date: string]: {
      [currency: string]: number;
    };
  };
}

// Use Free Currency API with user's API key
const CURRENCY_API_BASE = 'https://api.freecurrencyapi.com/v1';
const API_KEY = process.env.FREECURRENCYAPI_KEY;

export async function getCurrencyRates(baseCurrency = 'USD', targetCurrency = 'INR'): Promise<number> {
  try {
    if (!API_KEY) {
      console.warn('FREECURRENCYAPI_KEY not found, using fallback rate');
      return 85.0;
    }

    const response = await fetch(`${CURRENCY_API_BASE}/latest?apikey=${API_KEY}&base_currency=${baseCurrency}&currencies=${targetCurrency}`);
    
    if (!response.ok) {
      console.error('Currency API error:', response.status, response.statusText);
      return 85.0;
    }
    
    const data: FreeCurrencyAPIResponse = await response.json();
    return data.data[targetCurrency] || 85.0;
  } catch (error) {
    console.error('Error fetching currency rate:', error);
    return 85.0;
  }
}

export async function convertINRToUSD(inrAmount: number): Promise<number> {
  try {
    if (!API_KEY) {
      console.warn('FREECURRENCYAPI_KEY not found, using fallback conversion');
      return inrAmount / 85.0;
    }

    const response = await fetch(`${CURRENCY_API_BASE}/latest?apikey=${API_KEY}&base_currency=INR&currencies=USD`);
    
    if (!response.ok) {
      return inrAmount / 85.0;
    }
    
    const data: FreeCurrencyAPIResponse = await response.json();
    const rate = data.data.USD || (1/85.0);
    return inrAmount * rate;
  } catch (error) {
    console.error('Error converting INR to USD:', error);
    return inrAmount / 85.0;
  }
}

export async function get6MonthAverageUSDToINR(): Promise<{ 
  average: number; 
  monthlyRates: { month: string; rate: number }[] 
}> {
  try {
    if (!API_KEY) {
      console.warn('FREECURRENCYAPI_KEY not found, using fallback rates');
      return { 
        average: 85.0, 
        monthlyRates: [
          { month: 'Jan 2025', rate: 85.0 },
          { month: 'Feb 2025', rate: 84.5 },
          { month: 'Mar 2025', rate: 85.5 },
          { month: 'Apr 2025', rate: 84.8 },
          { month: 'May 2025', rate: 85.2 },
          { month: 'Jun 2025', rate: 85.1 }
        ]
      };
    }

    // Get historical rates for the last 6 months
    const monthlyRates: { month: string; rate: number }[] = [];
    const currentDate = new Date();
    let totalRates = 0;
    let validMonths = 0;

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const dateStr = targetDate.toISOString().split('T')[0];
      
      try {
        const response = await fetch(`${CURRENCY_API_BASE}/historical?apikey=${API_KEY}&date=${dateStr}&base_currency=USD&currencies=INR`);
        
        if (response.ok) {
          const data: HistoricalRatesResponse = await response.json();
          const rate = data.data[dateStr]?.INR || 85.0;
          
          monthlyRates.push({
            month: targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            rate: Math.round(rate * 100) / 100
          });
          
          totalRates += rate;
          validMonths++;
        } else {
          // Add fallback rate for this month
          monthlyRates.push({
            month: targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            rate: 85.0
          });
          totalRates += 85.0;
          validMonths++;
        }
      } catch (monthError) {
        console.error(`Error fetching rate for ${dateStr}:`, monthError);
        // Add fallback rate for this month
        monthlyRates.push({
          month: targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          rate: 85.0
        });
        totalRates += 85.0;
        validMonths++;
      }
    }
    
    const average = validMonths > 0 ? Math.round((totalRates / validMonths) * 100) / 100 : 85.0;
    
    return { average, monthlyRates };
  } catch (error) {
    console.error('Error getting 6-month average:', error);
    // Fallback with sample data
    return { 
      average: 85.0, 
      monthlyRates: [
        { month: 'Jan 2025', rate: 85.0 },
        { month: 'Feb 2025', rate: 84.5 },
        { month: 'Mar 2025', rate: 85.5 },
        { month: 'Apr 2025', rate: 84.8 },
        { month: 'May 2025', rate: 85.2 },
        { month: 'Jun 2025', rate: 85.1 }
      ]
    };
  }
}

export function calculateGST(amount: number, rate: number = 18): number {
  return Math.round((amount * rate / 100) * 100) / 100;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export async function convertCurrencyToINR(amount: number, fromCurrency: string): Promise<{
  originalAmount: number;
  fromCurrency: string;
  convertedAmount: number;
  conversionRate: number;
  sixMonthAverage: number;
  monthlyBreakdown: { month: string; rate: number }[];
}> {
  try {
    if (fromCurrency === 'INR') {
      // No conversion needed
      return {
        originalAmount: amount,
        fromCurrency: 'INR',
        convertedAmount: amount,
        conversionRate: 1.0,
        sixMonthAverage: 1.0,
        monthlyBreakdown: []
      };
    }

    // Get current rate and 6-month average
    const currentRate = await getCurrencyRates(fromCurrency, 'INR');
    const { average: sixMonthAverage, monthlyRates } = await get6MonthAverageUSDToINR();
    
    // Use 6-month average for conversion
    const convertedAmount = amount * sixMonthAverage;
    
    return {
      originalAmount: amount,
      fromCurrency,
      convertedAmount: Math.round(convertedAmount * 100) / 100,
      conversionRate: currentRate,
      sixMonthAverage,
      monthlyBreakdown: monthlyRates
    };
  } catch (error) {
    console.error('Error in currency conversion:', error);
    // Fallback conversion
    const fallbackRate = 85.0;
    return {
      originalAmount: amount,
      fromCurrency,
      convertedAmount: Math.round((amount * fallbackRate) * 100) / 100,
      conversionRate: fallbackRate,
      sixMonthAverage: fallbackRate,
      monthlyBreakdown: [
        { month: 'Jan 2025', rate: 85.0 },
        { month: 'Feb 2025', rate: 84.5 },
        { month: 'Mar 2025', rate: 85.5 },
        { month: 'Apr 2025', rate: 84.8 },
        { month: 'May 2025', rate: 85.2 },
        { month: 'Jun 2025', rate: 85.1 }
      ]
    };
  }
}