/**
 * Format currency values
 * @param {number} value - The value to format
 * @param {string} currencyCode - The currency code (default: USD)
 * @param {string} locale - The locale (default: en-US)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value, currencyCode = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
};

/**
 * Format percentage values
 * @param {number} value - The value to format (e.g., 0.05 for 5%)
 * @param {number} decimalPoints - Number of decimal points (default: 2)
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (value, decimalPoints = 2) => {
  return `${(value * 100).toFixed(decimalPoints)}%`;
};

/**
 * Format date values
 * @param {string} dateString - The date string to format
 * @param {object} options - Intl.DateTimeFormat options (default: { month: 'long', day: 'numeric', year: 'numeric' })
 * @param {string} locale - The locale (default: en-US)
 * @returns {string} - Formatted date string
 */
export const formatDate = (
  dateString,
  options = { month: 'long', day: 'numeric', year: 'numeric' },
  locale = 'en-US'
) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  
  return new Intl.DateTimeFormat(locale, options).format(date);
};

/**
 * Calculate loan progress percentage
 * @param {object} loan - The loan object
 * @returns {number} - Progress percentage (0-100)
 */
export const calculateLoanProgress = (loan) => {
  if (!loan) return 0;
  
  const amountPaid = loan.amountPaid || 0;
  const totalAmount = loan.totalAmount || 0;
  
  if (totalAmount === 0) return 0;
  
  return Math.min(100, Math.round((amountPaid / totalAmount) * 100));
};

/**
 * Get appropriate Bootstrap 5 CSS class for loan status
 * @param {string} status - The loan status
 * @returns {string} - CSS class name
 */
export const getLoanStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-success';
    case 'pending':
      return 'bg-warning';
    case 'repaid':
      return 'bg-info';
    case 'defaulted':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
};

/**
 * Truncate long text with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation (default: 50)
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substr(0, maxLength)}...`;
}; 