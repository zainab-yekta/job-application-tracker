// src/utils/FormatDate.js

// Dates are stored as 'YYYY-MM-DD'. new Date('YYYY-MM-DD') treats that as UTC
// midnight, which shows the previous day in timezones west of UTC, so parse the
// parts and build a local date instead.
export function parseLocalDate(isoDate, time) {
  if (!isoDate) return null;

  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return null;

  const [hours, minutes] = time ? time.split(':').map(Number) : [0, 0];
  const date = new Date(year, month - 1, day, hours || 0, minutes || 0);
  return isNaN(date) ? null : date;
}

export function formatDisplayDate(isoDate) {
  const date = parseLocalDate(isoDate);
  if (!date) return 'N/A';

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
