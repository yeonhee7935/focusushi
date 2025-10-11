export type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" | "ULTRA_RARE";

export type FoodCategory = "SUSHI" | "DESSERT" | "APPETIZER";

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  rarity: Rarity;
  image: string; // local asset path or require key
  description?: string;
}

export interface AcquisitionLog {
  itemId: string;
  acquiredAt: number; // epoch ms
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
  category: FoodCategory;
  focusMs: number;
  breakMs: number;
  items: CourseItem[]; // 보상 내역(코스 맥락)
}
