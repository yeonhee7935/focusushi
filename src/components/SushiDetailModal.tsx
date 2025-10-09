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

// 희귀도 표시를 위한 한글 매핑 함수
function getRarityName(r: Rarity): string {
  switch (r) {
    case "common":
      return "일반";
    case "rare":
      return "희귀";
    case "epic":
      return "영웅";
    case "legendary":
      return "전설";
    default:
      return "알 수 없음";
  }
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

            {/* 초밥 설명: React Native의 Text는 기본적으로 띄어쓰기 단위로 줄 바꿈 처리됩니다. */}
            <Text style={styles.description}>{sushi.description}</Text>

            <View style={styles.rarityContainer}>
              <Text style={styles.rarityLabel}>
                {getRarityName(sushi.rarity)} 등급
              </Text>
              <Text style={styles.meta}>
                (획득 확률: {rarityPercent(sushi.rarity)})
              </Text>
            </View>

            <Text style={styles.countText}>총 보유: {count}개</Text>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </Pressable>
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
    fontSize: 24,
    fontWeight: "900",
    color: "#111",
    marginTop: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  rarityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  rarityLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
    marginRight: 5,
  },
  meta: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
  countText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginTop: 15,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
