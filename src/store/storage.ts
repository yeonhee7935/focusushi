import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  APP_SETTINGS: "app.settings",
  CURRENT_COURSE: "currentCourse",
  COURSE_HISTORY: "courseHistory",
  FOOD_ACQUISITIONS: "food.acquisitions",
  SNAPSHOT: "snapshot",
} as const;

const encode = (v: unknown) => JSON.stringify(v);
const decode = <T>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export async function load<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  return decode<T>(raw, fallback);
}

export async function save<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, encode(value));
}

export async function update<T>(key: string, updater: (prev: T | undefined) => T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  const prev = raw ? (JSON.parse(raw) as T) : undefined;
  const next = updater(prev);
  await AsyncStorage.setItem(key, encode(next));
  return next;
}

export async function remove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function exists(key: string): Promise<boolean> {
  return (await AsyncStorage.getItem(key)) !== null;
}
