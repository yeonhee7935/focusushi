// src/screens/TimerScreen.tsx
import React, { useCallback, useEffect } from "react";
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

const CHEF_IMAGE: ImageSourcePropType = require("../../assets/character/chef.png");

export default function TimerScreen() {
  const { isRunning, phase, start, pause, reset, mmss } = usePomodoroTimer({
    autoStartBreak: false,
  });

  useEffect(() => {
    if (!isRunning && phase === "focus") start();
  }, [isRunning, phase, start]);

  const onPressExit = useCallback(() => {
    pause();
    reset();
  }, [pause, reset]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 세로 정렬: 캐릭터 → 남은 시간 → 종료 버튼 */}
      <View style={styles.stack}>
        <Image
          source={CHEF_IMAGE}
          style={styles.character}
          resizeMode="contain"
        />

        <Text style={styles.timeText}>{mmss()}</Text>

        <TouchableOpacity
          style={styles.exitBtn}
          onPress={onPressExit}
          accessibilityLabel="세션 종료"
        >
          <Text style={styles.exitText}>종료</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8E1" },
  stack: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center", // 화면 중앙에 세로로 배치
    paddingHorizontal: 24,
    gap: 16, // RN 0.71+ 지원. 낮은 버전이면 margin으로 조절
  },
  character: { width: 260, height: 260 },
  timeText: { fontSize: 32, fontWeight: "900", color: "#333", marginTop: 4 },
  exitBtn: {
    marginTop: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: "#FF5722",
    borderRadius: 12,
  },
  exitText: { color: "#fff", fontWeight: "900", fontSize: 16 },
});
