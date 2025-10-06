// src/screens/TimerScreen.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import ConfirmExitModal from "../components/ConfirmExitModal";

const CHEF_IMAGE: ImageSourcePropType = require("../../assets/character/chef.png");

export default function TimerScreen() {
  const { isRunning, phase, start, pause, reset, mmss } = usePomodoroTimer({
    autoStartBreak: false,
  });

  const [shouldAutoStart, setShouldAutoStart] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (shouldAutoStart && !isRunning && phase === "focus") {
      start();
      setShouldAutoStart(false);
    }
  }, [shouldAutoStart, isRunning, phase, start]);

  const handleStart = useCallback(() => {
    if (!isRunning && phase === "focus") {
      start();
    }
  }, [isRunning, phase, start]);

  const onPressExit = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const keepFocusing = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const confirmExit = useCallback(() => {
    setConfirmOpen(false);
    setShouldAutoStart(false);
    pause();
    reset();
  }, [pause, reset]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stack}>
        <Image
          source={CHEF_IMAGE}
          style={styles.character}
          resizeMode="contain"
        />
        <Text style={styles.timeText}>{mmss()}</Text>
        {isRunning ? (
          <TouchableOpacity
            style={[styles.exitBtn, confirmOpen && styles.disabledBtn]}
            onPress={onPressExit}
            disabled={confirmOpen}
            accessibilityLabel="세션 종료"
          >
            <Text style={styles.exitText}>종료</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.startBtn}
            onPress={handleStart}
            accessibilityLabel="세션 시작"
          >
            <Text style={styles.startText}>시작</Text>
          </TouchableOpacity>
        )}
      </View>
      <ConfirmExitModal
        visible={confirmOpen}
        onKeep={keepFocusing}
        onExit={confirmExit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8E1" },
  stack: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  character: { width: 260, height: 260 },
  timeText: { fontSize: 32, fontWeight: "900", color: "#333", marginTop: 4 },
  startBtn: {
    marginTop: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: "#42A5F5", // 시작은 파란색 계열로 구분
    borderRadius: 12,
  },
  startText: { color: "#fff", fontWeight: "900", fontSize: 16 },

  exitBtn: {
    marginTop: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: "#FF5722",
    borderRadius: 12,
  },
  exitText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  disabledBtn: { opacity: 0.6 },
});
