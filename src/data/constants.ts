import { AppSettings, Rarity } from "./types";

export const DEFAULT_SETTINGS: AppSettings = {
  defaultFocusMs: 25 * 60 * 1000,
  defaultBreakMs: 5 * 60 * 1000,
  vibration: true,
  sound: true,
};

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  COMMON: 70,
  UNCOMMON: 20,
  RARE: 7,
  EPIC: 2,
  LEGENDARY: 1,
  ULTRA_RARE: 0.5,
};
