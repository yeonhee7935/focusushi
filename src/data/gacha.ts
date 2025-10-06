import raw from "./sushi.json";
import { withResolvedImages } from "./sushiImage";
import type { Rarity, Sushi, SushiBase } from "../types";
import { isSushiBaseArray } from "../types";

export const DEFAULT_WEIGHTS: Record<Rarity, number> = {
  common: 70,
  rare: 20,
  epic: 9,
  legendary: 1,
};

/** 내부 상태(가중치 & 리스트 캐시) */
let weights: Record<Rarity, number> = { ...DEFAULT_WEIGHTS };
let cachedList: Sushi[] | null = null;

export function getSushiList(): Sushi[] {
  if (cachedList) return cachedList;

  const list = raw as unknown as SushiBase[];
  if (!isSushiBaseArray(list)) {
    throw new Error("Invalid sushi.json schema");
  }

  cachedList = withResolvedImages(list);
  return cachedList;
}

function pickRarity(): Rarity {
  const entries = Object.entries(weights) as [Rarity, number][];
  const total = entries.reduce((acc, [, w]) => acc + w, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (const [rarity, w] of entries) {
    acc += w;
    if (r < acc) return rarity;
  }
  return "common";
}

function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 가챠 실행: 캐시된 데이터에서 1개 반환
 * - 뽑힌 희귀도에 해당 아이템이 없으면(데이터 누락 등) 전체에서 fallback
 */
export function rollSushi(): Sushi {
  const list = getSushiList();
  const rarity = pickRarity();
  const bucket = list.filter((s) => s.rarity === rarity);
  return bucket.length > 0 ? sample(bucket) : sample(list);
}
