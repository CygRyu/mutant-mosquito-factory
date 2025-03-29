
export const formatNumber = (num: number): string => {
  if (num === undefined || num === null) return '0';
  
  if (num < 1000) return num.toFixed(1).replace(/\.0$/, '');
  
  const units = ['', 'K', 'M', 'B', 'T'];
  const unitIndex = Math.floor(Math.log10(num) / 3);
  
  // If greater than trillion, still format it correctly
  const unitIndexCapped = Math.min(unitIndex, units.length - 1);
  
  // Format the number
  const formatted = (num / Math.pow(1000, unitIndexCapped)).toFixed(1).replace(/\.0$/, '');
  
  return formatted + units[unitIndexCapped];
};
