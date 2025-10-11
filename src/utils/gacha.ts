import type { FoodItem, Rarity } from "../data/types";

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  COMMON: 70,
  UNCOMMON: 20,
  RARE: 7,
  EPIC: 2,
  LEGENDARY: 1,
  ULTRA_RARE: 0.5,
};

export interface GachaInput {
  pool: FoodItem[];
}

export interface GachaResult {
  item: FoodItem;
  rarity: Rarity;
}

export function rollGacha(_input: GachaInput): GachaResult {
  throw new Error("Not implemented yet");
}
