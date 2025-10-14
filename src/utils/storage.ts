const isClient = typeof window !== "undefined";

const clone = <T>(value: T): T => {
  if (value === null || typeof value !== "object") {
    return value;
  }
  return JSON.parse(JSON.stringify(value)) as T;
};

export const readStorage = <T>(key: string, fallback: T): T => {
  if (!isClient) return clone(fallback);

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return clone(fallback);
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Failed to parse localStorage key "${key}", using fallback.`, error);
    return clone(fallback);
  }
};

export const writeStorage = <T>(key: string, value: T): void => {
  if (!isClient) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to persist localStorage key "${key}".`, error);
  }
};

export const removeStorage = (key: string): void => {
  if (!isClient) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove localStorage key "${key}".`, error);
  }
};
