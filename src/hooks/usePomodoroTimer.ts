import { useCallback, useEffect, useRef, useState } from "react";

export type PomodoroPhase = "focus" | "break";

export type UsePomodoroTimerOptions = {
  /** 포커스/휴식 기본 길이(초) */
  focusSeconds?: number; // 기본 25 * 60
  breakSeconds?: number; // 기본 5 * 60
  /** 포커스 종료 시 호출(보상 트리거 등) */
  onFocusComplete?: () => void;
  /** 휴식이 끝났을 때 호출(선택) */
  onBreakComplete?: () => void;
  /** 단계가 바뀔 때 호출(선택) */
  onPhaseChange?: (phase: PomodoroPhase) => void;
  /** 휴식 단계로 넘어가면 자동 시작할지 */
  autoStartBreak?: boolean; // 기본 true
};

export type UsePomodoroTimerReturn = {
  /** 남은 시간(초) */
  remaining: number;
  /** 실행 중 여부 */
  isRunning: boolean;
  /** 현재 단계 */
  phase: PomodoroPhase;
  /** 진행률 0~1 (UI에서 원형 게이지 등) */
  progress: number;

  /** 타이머 시작/재개 */
  start: () => void;
  /** 일시정지 */
  pause: () => void;
  /** 현재 단계 처음으로 리셋 */
  reset: () => void;
  /**
   * 다음 단계로 즉시 건너뛰기
   * - focus 중이면 break로, break 중이면 focus로 전환
   */
  skip: () => void;

  /** 남은 시간 "MM:SS" 포맷 */
  mmss: () => string;
};

export function usePomodoroTimer(
  opts: UsePomodoroTimerOptions = {}
): UsePomodoroTimerReturn {
  const FOCUS = Math.max(1, opts.focusSeconds ?? 25 * 60);
  const BREAK = Math.max(1, opts.breakSeconds ?? 5 * 60);
  const AUTO_BREAK = opts.autoStartBreak ?? true;

  const [phase, setPhase] = useState<PomodoroPhase>("focus");
  const [remaining, setRemaining] = useState<number>(FOCUS);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // 현재 단계의 총 길이(진행률 계산용)
  const totalRef = useRef<number>(FOCUS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** ---- 유틸 ---- */
  const phaseTotal = useCallback(
    (p: PomodoroPhase) => (p === "focus" ? FOCUS : BREAK),
    [FOCUS, BREAK]
  );

  const formatMMSS = useCallback((sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, []);

  /** ---- 인터벌 제어 ---- */
  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startInterval = useCallback((tickFn: () => void) => {
    if (intervalRef.current) return;
    setIsRunning(true);
    intervalRef.current = setInterval(tickFn, 1000);
  }, []);

  /** ---- 단계 전환 ---- */
  const switchTo = useCallback(
    (next: PomodoroPhase) => {
      setPhase(next);
      const total = phaseTotal(next);
      totalRef.current = total;
      setRemaining(total);
      opts.onPhaseChange?.(next);
    },
    [opts, phaseTotal]
  );

  const endCurrentPhase = useCallback(() => {
    if (phase === "focus") {
      // 포커스 종료: 보상 트리거 → 휴식으로
      opts.onFocusComplete?.();
      switchTo("break");
      if (AUTO_BREAK) {
        // 휴식 자동 시작
        setTimeout(() => startInterval(tickOnce), 0);
      }
    } else {
      // 휴식 종료: 포커스로 복귀
      opts.onBreakComplete?.();
      switchTo("focus");
    }
  }, [AUTO_BREAK, opts, phase, startInterval, switchTo]);

  /** ---- 1틱 처리 ---- */
  const tickOnce = useCallback(() => {
    setRemaining((prev) => {
      if (prev <= 1) {
        // 단계 종료 처리 (인터벌 정지 + 전환)
        stopInterval();
        setIsRunning(false);
        endCurrentPhase();
        return prev; // 전환 함수에서 즉시 초기화됨
      }
      return prev - 1;
    });
  }, [endCurrentPhase, stopInterval]);

  /** ---- 공개 제어 메서드 ---- */
  const start = useCallback(() => {
    if (isRunning) return;
    startInterval(tickOnce);
  }, [isRunning, startInterval, tickOnce]);

  const pause = useCallback(() => {
    stopInterval();
    setIsRunning(false);
  }, [stopInterval]);

  const reset = useCallback(() => {
    pause();
    const total = phaseTotal(phase);
    totalRef.current = total;
    setRemaining(total);
  }, [pause, phase, phaseTotal]);

  const skip = useCallback(() => {
    // 사용자 임의 스킵: 포커스 스킵 시 보상 트리거 없음
    pause();
    if (phase === "focus") {
      switchTo("break");
      if (AUTO_BREAK) start();
    } else {
      switchTo("focus");
    }
  }, [AUTO_BREAK, pause, phase, start, switchTo]);

  /** 언마운트 시 인터벌 정리 */
  useEffect(() => () => stopInterval(), [stopInterval]);

  /** 설정값/단계 변경 시 총길이 재동기화(안전망) */
  useEffect(() => {
    totalRef.current = phaseTotal(phase);
  }, [phase, phaseTotal]);

  const mmss = useCallback(
    () => formatMMSS(remaining),
    [formatMMSS, remaining]
  );

  const progress =
    totalRef.current > 0
      ? (totalRef.current - remaining) / totalRef.current
      : 0;

  return {
    remaining,
    isRunning,
    phase,
    progress,
    start,
    pause,
    reset,
    skip,
    mmss,
  };
}
