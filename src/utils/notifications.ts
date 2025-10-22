/**
 * Check if a notification is "new" (created within the specified time window)
 * @param iso ISO 8601 date string
 * @param windowMs Time window in milliseconds (default: 24 hours)
 * @returns true if the notification is within the time window
 */
export const isNewNotification = (iso: string, windowMs = 24 * 60 * 60 * 1000): boolean => {
  const created = new Date(iso).getTime();
  return Number.isFinite(created) && Date.now() - created <= windowMs;
};

