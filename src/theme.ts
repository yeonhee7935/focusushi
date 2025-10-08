import type { Rarity, RarityColorMap } from "./types";

export const palette = {
  bg: "#000000",
  surface: "#1C1C1C",
  primary: "#FF5722",
  secondary: "#333333",
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
};

export const RARITY_COLORS: RarityColorMap = {
  common: "#9E9E9E",
  rare: "#42A5F5",
  epic: "#7E57C2",
  legendary: "#F9A825",
};

export const RARITY_LABELS: Record<Rarity, string> = {
  common: "일반",
  rare: "희귀",
  epic: "에픽",
  legendary: "전설",
};
