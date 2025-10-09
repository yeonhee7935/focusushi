// components/ConfirmBreakModal.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../theme";

type Props = {
  visible: boolean;
  onYes: () => void;
  onNo: () => void;
};

export default function ConfirmBreakModal({ visible, onYes, onNo }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onNo}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>잠시 쉬어갈까요?</Text>
          <Text style={styles.message}>휴식을 시작할지 선택해 주세요.</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onNo}
              style={[styles.btn, styles.secondary]}
              accessibilityLabel="바로 대기 상태로"
            >
              <Text style={styles.secondaryText}>아니오</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onYes}
              style={[styles.btn, styles.primary]}
              accessibilityLabel="휴식 시작"
            >
              <Text style={styles.primaryText}>예</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    fontSize: 18,
    fontWeight: "800",
    color: palette.text,
    textAlign: "center",
  },
  message: {
    marginTop: 8,
    color: palette.textSecondary,
    textAlign: "center",
  },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: palette.primary },
  primaryText: { color: "#fff", fontWeight: "800" },
  secondary: { backgroundColor: palette.surface },
  secondaryText: { color: palette.text, fontWeight: "800" },
});
