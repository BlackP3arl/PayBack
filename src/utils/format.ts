import { format, parseISO, formatDistanceToNow } from 'date-fns';

/**
 * Format a number as MVR currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "MVR 2,500.00")
 */
export const formatCurrency = (amount: number): string => {
  return `MVR ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format a date string to display format
 * @param dateString - ISO date string
 * @param formatString - Format pattern (default: 'dd MMM yyyy')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, formatString: string = 'dd MMM yyyy'): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

/**
 * Format a date string to relative time
 * @param dateString - ISO date string
 * @returns Relative time string (e.g., "2 days ago")
 */
export const formatRelativeDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Relative date formatting error:', error);
    return dateString;
  }
};

/**
 * Check if a date is overdue
 * @param dateString - ISO date string
 * @returns True if the date is in the past
 */
export const isOverdue = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    return date < new Date();
  } catch (error) {
    console.error('Date comparison error:', error);
    return false;
  }
};

/**
 * Generate a unique ID
 * @returns A unique identifier string
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate a numeric input
 * @param value - The value to validate
 * @returns True if valid number greater than 0
 */
export const isValidAmount = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
};

/**
 * Parse a currency input string to number
 * @param value - The currency string to parse
 * @returns Parsed number or 0 if invalid
 */
export const parseCurrencyInput = (value: string): number => {
  // Remove any non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

/**
 * Truncate text to a maximum length
 * @param text - The text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Check if a file URI is an image
 * @param uri - The file URI to check
 * @returns True if the file is an image
 */
export const isImageFile = (uri: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const lowerUri = uri.toLowerCase();
  return imageExtensions.some(ext => lowerUri.endsWith(ext));
};

/**
 * Check if a file URI is a PDF
 * @param uri - The file URI to check
 * @returns True if the file is a PDF
 */
export const isPdfFile = (uri: string): boolean => {
  return uri.toLowerCase().endsWith('.pdf');
};

/**
 * Get the file name from a URI
 * @param uri - The file URI
 * @returns The file name
 */
export const getFileName = (uri: string): string => {
  const parts = uri.split('/');
  return parts[parts.length - 1] || 'document';
};
