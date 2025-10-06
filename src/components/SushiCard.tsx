import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
} from "react-native";
import type { Sushi } from "../types";
import { palette, RARITY_COLORS, RARITY_LABELS } from "../theme";

type Props = {
  sushi: Sushi;
  count?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function SushiCard({ sushi, count, onPress, style }: Props) {
  const Container = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      style={[styles.card, style, { borderColor: RARITY_COLORS[sushi.rarity] }]}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${sushi.name}, ${RARITY_LABELS[sushi.rarity]}${typeof count === "number" ? `, 보유 ${count}개` : ""}`}
      testID={`SushiCard_${sushi.id}`}
    >
      <View style={styles.imageWrap}>
        <Image source={sushi.image} resizeMode="contain" style={styles.image} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {sushi.name}
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: RARITY_COLORS[sushi.rarity] },
          ]}
        >
          <Text style={styles.badgeText}>{RARITY_LABELS[sushi.rarity]}</Text>
        </View>
      </View>

      {typeof count === "number" && (
        <View style={styles.countBubble}>
          <Text style={styles.countText}>× {count}</Text>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 2,
    width: 140,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  imageWrap: {
    backgroundColor: palette.bg,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    height: 100,
  },
  image: { width: "100%", height: "100%" },
  info: { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 8 },
  name: { flex: 1, fontSize: 14, fontWeight: "700", color: palette.text },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  countBubble: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: palette.primary,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: { color: "#fff", fontSize: 12, fontWeight: "800" },
});
