import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  APP_SETTINGS: "app.settings",
  CURRENT_COURSE: "currentCourse",
  COURSE_HISTORY: "courseHistory",
  FOOD_ACQUISITIONS: "food.acquisitions",
  SNAPSHOT: "snapshot",
} as const;

export async function load<T>(key: string, fallback: T): Promise<T> {
  try {
    const v = await AsyncStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function save<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
