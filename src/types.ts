import type { ImageSourcePropType } from "react-native";

export type Rarity = "common" | "rare" | "epic" | "legendary";

export type SushiBase = {
  id: string;
  name: string;
  rarity: Rarity;
  imageFile: string;
};

export type Sushi = SushiBase & {
  image: ImageSourcePropType;
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

export function isSushiBaseArray(x: unknown): x is SushiBase[] {
  return (
    Array.isArray(x) &&
    x.every(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.rarity === "string" &&
        ["common", "rare", "epic", "legendary"].includes(item.rarity) &&
        typeof item.imageFile === "string"
    )
  );
}
