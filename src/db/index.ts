// src/db/index.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { OwnedSushi, Stats } from "../types";

/**
 * 외부 노출 API (단 5개)
 * - recordAcquisition(sushiId, when?)
 * - getCollection()
 * - getHistory()
 * - getStats()
 * - resetAll()  // 개발용
 */

/** ---------- Storage Keys ---------- */
const KEY_COLLECTION = "collection_v1";
const KEY_HISTORY = "history_v1";
const KEY_STATS = "stats_v1";

/** ---------- Types (히스토리 전용 로컬 타입) ---------- */
type AcquisitionHistoryEntry = {
  sushiId: string;
  completedAtISO: string; // ISO timestamp
};

/** ---------- Defaults ---------- */
const DEFAULT_COLLECTION: OwnedSushi[] = [];
const DEFAULT_HISTORY: AcquisitionHistoryEntry[] = [];
const DEFAULT_STATS: Stats = {
  totalFocusCount: 0,
  totalCollectedCount: 0,
};

/** =========================================================
 * 내부 전용(비공개) 헬퍼들 — export 하지 마세요.
 * =======================================================*/
async function readCollection(): Promise<OwnedSushi[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_COLLECTION);
    return raw ? (JSON.parse(raw) as OwnedSushi[]) : DEFAULT_COLLECTION;
  } catch {
    return DEFAULT_COLLECTION;
  }
}

async function writeCollection(list: OwnedSushi[]): Promise<void> {
  await AsyncStorage.setItem(KEY_COLLECTION, JSON.stringify(list));
}

async function increaseOwnedCount(
  sushiId: string,
  delta = 1
): Promise<OwnedSushi[]> {
  const list = await readCollection();
  const idx = list.findIndex((i) => i.id === sushiId);
  if (idx >= 0) list[idx].count += delta;
  else list.push({ id: sushiId, count: delta });
  await writeCollection(list);
  return list;
}

async function readHistory(): Promise<AcquisitionHistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_HISTORY);
    return raw
      ? (JSON.parse(raw) as AcquisitionHistoryEntry[])
      : DEFAULT_HISTORY;
  } catch {
    return DEFAULT_HISTORY;
  }
}

async function writeHistory(list: AcquisitionHistoryEntry[]): Promise<void> {
  await AsyncStorage.setItem(KEY_HISTORY, JSON.stringify(list));
}

async function appendHistory(
  sushiId: string,
  when?: Date
): Promise<AcquisitionHistoryEntry[]> {
  const current = await readHistory();
  const entry: AcquisitionHistoryEntry = {
    sushiId,
    completedAtISO: (when ?? new Date()).toISOString(),
  };
  const next = [entry, ...current];
  await writeHistory(next);
  return next;
}

async function readStats(): Promise<Stats> {
  try {
    const raw = await AsyncStorage.getItem(KEY_STATS);
    return raw ? (JSON.parse(raw) as Stats) : { ...DEFAULT_STATS };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

async function writeStats(stats: Stats): Promise<void> {
  await AsyncStorage.setItem(KEY_STATS, JSON.stringify(stats));
}

async function increaseStats(
  partial: Partial<Record<keyof Stats, number>>
): Promise<Stats> {
  const cur = await readStats();
  const next: Stats = {
    totalFocusCount:
      (cur.totalFocusCount ?? 0) + (partial.totalFocusCount ?? 0),
    totalCollectedCount:
      (cur.totalCollectedCount ?? 0) + (partial.totalCollectedCount ?? 0),
  };
  await writeStats(next);
  return next;
}

/**
 * 포커스 세션 성공
 * 내부에서 다음을 한 번에 처리합니다:
 * 1) 보유 목록 집계 증가
 * 2) 히스토리에 (시점 + 스시) 기록
 * 3) 통계에서 totalFocusCount, totalCollectedCount 증가
 */
export async function recordAcquisition(
  sushiId: string,
  when?: Date
): Promise<{
  collection: OwnedSushi[];
  history: AcquisitionHistoryEntry[];
  stats: Stats;
}> {
  const [collection, history, stats] = await Promise.all([
    increaseOwnedCount(sushiId, 1),
    appendHistory(sushiId, when),
    increaseStats({ totalFocusCount: 1, totalCollectedCount: 1 }),
  ]);
  return { collection, history, stats };
}

/** 보유 목록(집계) 조회 */
export async function getCollection(): Promise<OwnedSushi[]> {
  return readCollection();
}

/** 히스토리(최근 → 과거) 조회 */
export async function getHistory(): Promise<AcquisitionHistoryEntry[]> {
  return readHistory();
}

/** 통계 조회 */
export async function getStats(): Promise<Stats> {
  return readStats();
}

/**
 * 개발용 전체 초기화 (주의)
 * - 프로덕션에서는 노출하지 않거나 빌드 플래그로 제한 권장
 */
export async function resetAll(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(KEY_COLLECTION),
    AsyncStorage.removeItem(KEY_HISTORY),
    AsyncStorage.removeItem(KEY_STATS),
  ]);
}
