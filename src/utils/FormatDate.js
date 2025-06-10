// src/utils/FormatDate.js
export function formatDisplayDate(isoDate) {
  if (!isoDate) return 'N/A';

  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  // Get ordinal suffix
  const getOrdinal = (n) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${getOrdinal(day)} ${month} ${year}`;
}
