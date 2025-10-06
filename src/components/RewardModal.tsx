import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import type { Sushi } from "../types";
import { palette, RARITY_COLORS, RARITY_LABELS } from "../theme";

type Props = {
  visible: boolean;
  sushi: Sushi | null;
  onConfirm?: (sushi: Sushi) => Promise<void> | void;
  onClose?: () => void;
};

export default function RewardModal({
  visible,
  sushi,
  onConfirm,
  onClose,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const badgeStyle = useMemo(
    () => ({
      backgroundColor: sushi ? RARITY_COLORS[sushi.rarity] : "#BDBDBD",
    }),
    [sushi]
  );

  const handleConfirm = async () => {
    if (!sushi || submitting) return;
    try {
      setSubmitting(true);
      await onConfirm?.(sushi);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable
        style={styles.backdrop}
        onPress={submitting ? undefined : onClose}
      >
        <Pressable onPress={() => {}} style={styles.card}>
          <Text style={styles.title}>보상 획득!</Text>

          {sushi ? (
            <>
              <View style={styles.imageWrap}>
                <Image
                  source={sushi.image}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
              <Text style={styles.name}>{sushi.name}</Text>
              <View style={[styles.badge, badgeStyle]}>
                <Text style={styles.badgeText}>
                  {RARITY_LABELS[sushi.rarity]}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                아이템 정보를 불러오는 중…
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.secondary]}
              onPress={onClose}
              disabled={submitting}
            >
              <Text style={styles.btnTextSecondary}>닫기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                styles.primary,
                submitting && styles.btnDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!sushi || submitting}
            >
              {submitting ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.btnTextPrimary}>수집함에 추가</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: palette.bg,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: palette.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  imageWrap: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },
  image: { width: 160, height: 160 },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.text,
    textAlign: "center",
    marginTop: 12,
  },
  badge: {
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 6,
  },
  badgeText: { color: "#fff", fontWeight: "700" },
  placeholder: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginVertical: 12,
  },
  placeholderText: { color: "#666" },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: palette.primary },
  btnDisabled: { opacity: 0.6 },
  secondary: { backgroundColor: palette.secondary },
  btnTextPrimary: { color: "#fff", fontWeight: "800" },
  btnTextSecondary: { color: "#8D6E63", fontWeight: "800" },
});
