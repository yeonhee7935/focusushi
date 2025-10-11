import type { FoodItem, Rarity } from "../data/types";
import { RARITY_WEIGHTS } from "../data/constants";

export function pickByWeight<T extends string | number>(weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][];
  const valid: [T, number][] = [];
  for (const [k, w] of entries) {
    if (Number.isFinite(w) && w > 0) valid.push([k, w]);
  }
  if (valid.length === 0) {
    throw new Error("pickByWeight: no positive weights");
  }
  const total = valid.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [key, w] of valid) {
    r -= w;
    if (r <= 0) return key;
  }
  return valid[valid.length - 1]![0];
}

export function drawReward(pool: FoodItem[]): { item: FoodItem; rarity: Rarity } | null {
  if (!pool.length) return null;
  const rarity = pickByWeight<Rarity>(RARITY_WEIGHTS);
  const candidates = pool.filter((i) => i.rarity === rarity);
  const list = candidates.length ? candidates : pool;
  const item = list[Math.floor(Math.random() * list.length)]!;
  return { item, rarity: item.rarity };
}
