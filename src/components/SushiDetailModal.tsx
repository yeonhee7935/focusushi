import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Sushi, Rarity } from "../types";

/** 실제 가챠 확률 — gacha.ts의 가중치와 동일하게 맞추세요 */
const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 70,
  rare: 22,
  epic: 7,
  legendary: 1,
};

function rarityPercent(r: Rarity) {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  const pct = (RARITY_WEIGHTS[r] / total) * 100;
  return `${pct.toFixed(1)}%`;
}

type Props = {
  visible: boolean;
  onClose: () => void;
  sushi: Sushi;
  locked: boolean;
  count: number; // 총 보유 개수
};

export default function SushiDetailModal({
  visible,
  onClose,
  sushi,
  locked,
  count,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* 오버레이 누르면 닫힘 */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* 시트 내부는 닫히지 않게 */}
        <TouchableWithoutFeedback>
          <View style={styles.sheet}>
            <View style={styles.imageSquare}>
              {locked ? (
                <Ionicons name="lock-closed" size={44} color="#b0b0b0" />
              ) : (
                <Image
                  source={sushi.image}
                  resizeMode="contain"
                  style={styles.image}
                />
              )}
            </View>

            <Text style={styles.title}>{sushi.name}</Text>
            <Text style={styles.meta}>
              희귀도 확률: {rarityPercent(sushi.rarity)}
            </Text>
            <Text style={styles.meta}>총 보유: {count}개</Text>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 36,
    alignItems: "center",
  },
  imageSquare: {
    width: 120,
    height: 120,
    backgroundColor: "#f3f3f3",
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: "90%", height: "90%" },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111",
    marginTop: 16,
    textAlign: "center",
  },
  meta: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
    textAlign: "center",
  },
});
