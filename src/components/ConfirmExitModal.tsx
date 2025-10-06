import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  onKeep: () => void;
  onExit: () => void;
  disabled?: boolean;
  title?: string;
  message?: string;
};

export default function ConfirmExitModal({
  visible,
  onKeep,
  onExit,
  disabled,
  title = "정말 종료할까요?",
  message = "이 세션은 기록되지 않습니다.",
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onKeep}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardText}>{message}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.secondary]}
              onPress={onKeep}
              disabled={disabled}
              accessibilityLabel="계속 집중"
            >
              <Text style={styles.secondaryText}>계속 집중</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                styles.primary,
                disabled && styles.btnDisabled,
              ]}
              onPress={onExit}
              disabled={disabled}
              accessibilityLabel="종료"
            >
              <Text style={styles.primaryText}>종료</Text>
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
    backgroundColor: "#FFF8E1",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FF5722",
    textAlign: "center",
  },
  cardText: { marginTop: 8, color: "#6D4C41", textAlign: "center" },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: "#FF5722" },
  primaryText: { color: "#fff", fontWeight: "800" },
  secondary: { backgroundColor: "#FFE0B2" },
  secondaryText: { color: "#6D4C41", fontWeight: "800" },
  btnDisabled: { opacity: 0.6 },
});
