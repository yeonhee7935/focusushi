import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { load, save, remove, STORAGE_KEYS } from "../store/storage";
import type { TimerSnapshot } from "../store/snapshot";

export async function loadSnapshot(): Promise<TimerSnapshot | undefined> {
  return load<TimerSnapshot | undefined>(STORAGE_KEYS.SNAPSHOT, undefined);
}

export async function writeSnapshot(s: TimerSnapshot | undefined): Promise<void> {
  if (!s) return;
  await save<TimerSnapshot>(STORAGE_KEYS.SNAPSHOT, s);
}

export async function clearSnapshot(): Promise<void> {
  await remove(STORAGE_KEYS.SNAPSHOT);
}

/**
 * provider: 현재 타이머 상태를 스냅샷 형태로 반환하는 함수
 * - 앱이 active → 백그라운드/비활성 전환될 때 저장
 */
export function useSnapshotPersistence(provider: () => TimerSnapshot | undefined) {
  useEffect(() => {
    const onChange = (state: AppStateStatus) => {
      if (state !== "active") {
        const snap = provider();
        if (snap) writeSnapshot({ ...snap, savedAt: Date.now() });
      }
    };
    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, [provider]);
}
