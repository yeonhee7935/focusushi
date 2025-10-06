import type { ImageSourcePropType } from "react-native";

const registry: Record<string, ImageSourcePropType> = {
  "gyeran.png": require("../../assets/sushi/gyeran.png"),
  "chamchi.png": require("../../assets/sushi/chamchi.png"),
  "hanchi.png": require("../../assets/sushi/hanchi.png"),
  "gwangu.png": require("../../assets/sushi/gwangu.png"),
};
const fallback: ImageSourcePropType = require("../../assets/sushi/unknown.png");

export function getSushiImage(imageFile: string): ImageSourcePropType {
  return registry[imageFile] ?? fallback;
}

import type { SushiBase, Sushi } from "../types";
export function withResolvedImages(list: SushiBase[]): Sushi[] {
  return list.map((item) => ({
    ...item,
    image: getSushiImage(item.imageFile),
  }));
}
