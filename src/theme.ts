import type { Rarity, RarityColorMap } from "./types";

export const palette = {
  bg: "#FFF8E1",
  surface: "#FFFFFF",
  primary: "#FF5722",
  secondary: "#FFE0B2",
  text: "#333",
  textSecondary: "#6D4C41",
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
