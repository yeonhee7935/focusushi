import type { FoodItem, Rarity, FoodCategory } from "../data/types";

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  COMMON: 70,
  UNCOMMON: 20,
  RARE: 7,
  EPIC: 2,
  LEGENDARY: 1,
  ULTRA_RARE: 0.5,
};

export interface GachaInput {
  category: FoodCategory;
  pool: FoodItem[];
}

export interface GachaResult {
  item: FoodItem;
  rarity: Rarity;
}

export function rollGacha(_input: GachaInput): GachaResult {
  // 구현은 7단계에서
  throw new Error("Not implemented yet");
}
