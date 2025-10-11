export const ms = {
  min: (n: number) => n * 60_000,
  sec: (n: number) => n * 1_000,
};

export function formatMMSS(totalMs: number) {
  const s = Math.max(0, Math.floor(totalMs / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}
