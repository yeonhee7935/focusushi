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
import { Ionicons } from "@expo/vector-icons";
import type { Sushi } from "../types";

type Props = {
  sushi: Sushi;
  count?: number;
  locked: boolean; // 필수: 미획득 여부
  onPress: () => void; // 필수: 카드 탭
  style?: StyleProp<ViewStyle>;
};

export default function SushiCard({
  sushi,
  count,
  locked,
  onPress,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, style]}
      accessibilityRole="button"
      accessibilityLabel={`${sushi.name}${
        typeof count === "number" ? `, 보유 ${count}개` : ""
      }${locked ? ", 잠김" : ""}`}
      testID={`SushiCard_${sushi.id}`}
    >
      <View style={styles.imageBox}>
        {locked ? (
          <Ionicons name="lock-closed" size={32} color="#8a8a8a" />
        ) : (
          <Image
            source={sushi.image}
            resizeMode="contain"
            style={styles.image}
          />
        )}
      </View>

      <Text
        style={[styles.name, locked && styles.nameLocked]}
        numberOfLines={1}
      >
        {sushi.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
  },
  imageBox: {
    backgroundColor: "#3e3e3eff", // 동일 회색 박스
    borderRadius: 12,
    width: "100%",
    aspectRatio: 1, // 정방형 유지
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 17, // 이름 크게
    fontWeight: "800",
    color: "#f5f5f5",
    marginTop: 10,
    textAlign: "center",
  },
  nameLocked: {
    color: "#9a9a9a",
  },
});
