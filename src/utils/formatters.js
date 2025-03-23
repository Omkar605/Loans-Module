/**
 * Format number as currency
 * @param {number} amount - Amount to format
 * @param {string} locale - Locale to use, defaults to 'en-US'
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, locale = 'en-US') => {
  if (amount === undefined || amount === null) return '$0.00';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date to readable format
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale to use, defaults to 'en-US'
 * @returns {string} Formatted date
 */
export const formatDate = (date, locale = 'en-US') => {
  if (!date) return 'N/A';
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  };
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date with time
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale to use, defaults to 'en-US'
 * @returns {string} Formatted date with time
 */
export const formatDateTime = (date, locale = 'en-US') => {
  if (!date) return 'N/A';
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, options);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Invalid Date';
  }
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === undefined || value === null) return '0%';
  
  return `${(Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals)}%`;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substr(0, maxLength)}...`;
};

/**
 * Calculate loan progress percentage
 * @param {object} loan - Loan object with totalAmount and amountPaid
 * @returns {number} Progress percentage (0-100)
 */
export const calculateLoanProgress = (loan) => {
  if (!loan || !loan.totalAmount || loan.totalAmount <= 0) return 0;
  
  const progressPercentage = (loan.amountPaid / loan.totalAmount) * 100;
  
  // Cap at 100% and round to 1 decimal place
  return Math.min(Math.round(progressPercentage * 10) / 10, 100);
};

/**
 * Shorten number (e.g. 1000 -> 1K)
 * @param {number} num - Number to shorten
 * @returns {string} Shortened number
 */
export const shortenNumber = (num) => {
  if (num === null || num === undefined) return '0';
  if (num === 0) return '0';
  
  const absNum = Math.abs(num);
  const sign = Math.sign(num);
  
  if (absNum < 1000) return num.toString();
  
  const tier = Math.floor(Math.log10(absNum) / 3);
  const suffix = ['', 'K', 'M', 'B', 'T'][tier];
  const scale = Math.pow(10, tier * 3);
  
  const scaled = absNum / scale;
  const formatted = scaled.toFixed(1).replace(/\.0$/, '');
  
  return `${sign < 0 ? '-' : ''}${formatted}${suffix}`;
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPercentage,
  truncateText,
  calculateLoanProgress,
  shortenNumber
}; 