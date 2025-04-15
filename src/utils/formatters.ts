/**
 * Capitalizes the first letter of a string
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formats dog age in human years
 */
export const formatDogAge = (ageInYears: number): string => {
  if (ageInYears < 1) {
    const months = Math.round(ageInYears * 12);
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  
  return `${ageInYears} year${ageInYears !== 1 ? 's' : ''}`;
};

/**
 * Formats weight in pounds or kilograms
 */
export const formatWeight = (weight: number, unit: 'lb' | 'kg' = 'lb'): string => {
  const formattedWeight = weight.toFixed(1).replace(/\.0$/, '');
  return `${formattedWeight} ${unit}`;
}; 