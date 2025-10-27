export type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" | "ULTRA_RARE";

export type FoodCategory = "SUSHI" | "DESSERT" | "APPETIZER";

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  rarity: Rarity;
  image: number;
  description?: string;
}

export interface AcquisitionLog {
  itemId: string;
  acquiredAt: number;
}

export interface AppSettings {
  defaultFocusMs: number;
  defaultBreakMs: number;
  vibration: boolean;
  sound: boolean;
}

export interface CourseItem {
  itemId: string;
  acquiredAt: number;
}
export interface Course {
  id: string;
  startedAt: number;
  plannedSessions: number;
  completedSessions: number;
  focusMs: number;
  breakMs: number;
  items: CourseItem[];
}
