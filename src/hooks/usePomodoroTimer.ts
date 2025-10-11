import { useCallback, useEffect, useRef, useState } from "react";

type OnComplete = () => void;

export function usePomodoroTimer(initialMs: number, onComplete?: OnComplete) {
  const [remaining, setRemaining] = useState(Math.max(0, initialMs));
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const tickRef = useRef<number | null>(null);

  const clearTick = useCallback(() => {
    if (tickRef.current != null) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  // ⬇️ remaining에 의존하지 않도록 고정
  const start = useCallback(
    (ms?: number) => {
      clearTick();
      const seed = typeof ms === "number" ? ms : initialMs;
      setRemaining(Math.max(0, seed));
      setRunning(true);
      setPaused(false);
    },
    [clearTick, initialMs],
  );

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => {
    if (running) setPaused(false);
  }, [running]);

  const stop = useCallback(() => {
    clearTick();
    setRunning(false);
    setPaused(false);
  }, [clearTick]);

  useEffect(() => {
    if (!running || paused) {
      clearTick();
      return;
    }
    clearTick();
    tickRef.current = setInterval(() => {
      setRemaining((ms) => (ms > 0 ? ms - 1000 : 0));
    }, 1000);
    return clearTick;
  }, [running, paused, clearTick]);

  useEffect(() => {
    if (running && remaining === 0) {
      stop();
      onComplete?.();
    }
  }, [remaining, running, stop, onComplete]);

  return { remaining, running, paused, start, pause, resume, stop };
}
