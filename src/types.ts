import type { ImageSourcePropType } from "react-native";

export type Rarity = "common" | "rare" | "epic" | "legendary";

export type Sushi = {
  id: string;
  name: string;
  rarity: Rarity;
  image: ImageSourcePropType;
  description: string;
};

export type OwnedSushi = {
  id: string;
  count: number;
};

export type Stats = {
  totalFocusCount: number;
  totalCollectedCount: number;
};
export type RarityColorMap = Record<Rarity, string>;
