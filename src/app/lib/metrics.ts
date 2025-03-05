/**
 * Utility functions for metrics calculations and formatting
 */

/**
 * Format a number as currency
 * @param value The number to format
 * @param maximumFractionDigits The maximum number of decimal places to show
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, maximumFractionDigits: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(value);
}

/**
 * Format a number as a percentage
 * @param value The number to format (0.1 = 10%)
 * @param maximumFractionDigits The maximum number of decimal places to show
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, maximumFractionDigits: number = 1): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits,
  }).format(value);
}

/**
 * Calculate the percentage change between two values
 * @param current The current value
 * @param previous The previous value
 * @returns The percentage change
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return (current - previous) / previous;
}

/**
 * Format a percentage change with a + or - sign
 * @param change The percentage change (0.1 = 10%)
 * @returns Formatted percentage change string with sign
 */
export function formatPercentageChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return sign + formatPercentage(change);
}

/**
 * Parse a string value to a number
 * @param value The string value to parse
 * @returns The parsed number
 */
export function parseValue(value: string): number {
  // Remove quotes, spaces, and currency symbols
  const cleanValue = value.replace(/[""$,\s]/g, '');
  // Remove parentheses and make negative
  if (cleanValue.startsWith('(') && cleanValue.endsWith(')')) {
    return -Number(cleanValue.slice(1, -1));
  }
  return Number(cleanValue);
}

/**
 * Calculate the average of an array of numbers
 * @param values The array of numbers
 * @returns The average value
 */
export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculate the total of an array of numbers
 * @param values The array of numbers
 * @returns The total value
 */
export function calculateTotal(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}
