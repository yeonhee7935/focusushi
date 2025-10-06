import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RewardModal from "../components/RewardModal";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { rollSushi } from "../data/gacha";
import { recordAcquisition } from "../db";
import type { Sushi } from "../types";

export default function TimerScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [reward, setReward] = useState<Sushi | null>(null);

  const handleFocusComplete = useCallback(() => {
    const got = rollSushi(); // 가챠 1회
    setReward(got);
    setModalVisible(true); // 보상 모달 표시
  }, []);

  const { remaining, isRunning, phase, start, pause, reset, skip, mmss } =
    usePomodoroTimer({
      focusSeconds: 60 * 0.5,
      onFocusComplete: handleFocusComplete,
      autoStartBreak: false, // 보상 모달 동안 자동 진행 방지
    });

  const confirmReward = useCallback(async (s: Sushi) => {
    await recordAcquisition(s.id); // 집계/히스토리/통계 한 번에 업데이트
    setModalVisible(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.phasePill}>
        <Text style={styles.phaseText}>
          {phase === "focus" ? "집중" : "휴식"}
        </Text>
      </View>

      <View style={styles.timerCircle}>
        <Text style={styles.timerText}>{mmss()}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.primary, modalVisible && { opacity: 0.6 }]}
          onPress={isRunning ? pause : start}
          disabled={modalVisible}
        >
          <Text style={styles.btnText}>
            {isRunning
              ? "일시정지"
              : phase === "focus"
                ? "집중 시작"
                : "휴식 시작"}
          </Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.smallBtn,
              styles.secondary,
              modalVisible && { opacity: 0.6 },
            ]}
            onPress={reset}
            disabled={modalVisible}
          >
            <Text style={styles.smallBtnText}>리셋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.smallBtn,
              styles.secondary,
              modalVisible && { opacity: 0.6 },
            ]}
            onPress={skip}
            disabled={modalVisible}
          >
            <Text style={styles.smallBtnText}>건너뛰기</Text>
          </TouchableOpacity>
        </View>
      </View>

      <RewardModal
        visible={modalVisible}
        sushi={reward}
        onConfirm={confirmReward}
        onClose={() => setModalVisible(false)} // 닫기만 하면 저장/집계는 하지 않음
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
    alignItems: "center",
    paddingTop: 30,
  },
  phasePill: {
    backgroundColor: "#FFE0B2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  phaseText: { color: "#6D4C41", fontWeight: "800" },

  timerCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#FFD180",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  timerText: { fontSize: 56, fontWeight: "700", color: "#333" },

  actions: { marginTop: 28, width: "100%", paddingHorizontal: 24 },
  btn: {
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  primary: { backgroundColor: "#FF5722" },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "800" },

  row: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  smallBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#FFE0B2",
    borderRadius: 12,
  },
  secondary: {},
  smallBtnText: { color: "#6D4C41", fontWeight: "800" },
});
