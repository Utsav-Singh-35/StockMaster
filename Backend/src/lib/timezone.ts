/**
 * Timezone utility for Indian Standard Time (IST)
 * IST is UTC+5:30
 */

/**
 * Get current date/time in IST
 */
export function getISTDate(): Date {
  const now = new Date();
  // Convert to IST (UTC + 5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const istTime = new Date(utcTime + istOffset);
  return istTime;
}

/**
 * Convert UTC date to IST
 */
export function convertToIST(utcDate: Date): Date {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utcTime = utcDate.getTime();
  return new Date(utcTime + istOffset);
}

/**
 * Format date to IST string
 */
export function formatISTDate(date: Date): string {
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

/**
 * Get IST date string for database (YYYY-MM-DD)
 */
export function getISTDateString(): string {
  const istDate = getISTDate();
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get IST datetime string for database (YYYY-MM-DD HH:MM:SS)
 */
export function getISTDateTimeString(): string {
  const istDate = getISTDate();
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  const hours = String(istDate.getHours()).padStart(2, '0');
  const minutes = String(istDate.getMinutes()).padStart(2, '0');
  const seconds = String(istDate.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
