export const getDateKey = (date: Date = new Date()): string => date.toISOString().split("T")[0]!;

export const getTimeUntilReset = (from: Date = new Date()): string => {
  const now = from;
  const midnight = new Date(now);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);

  const diff = midnight.getTime() - now.getTime();
  const hours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));

  return `${hours}ч ${minutes}м`;
};

export const isSameDay = (left: Date, right: Date): boolean => getDateKey(left) === getDateKey(right);
