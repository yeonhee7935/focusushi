import React, { useCallback, useState } from "react";
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
import RewardModal from "../components/RewardModal";
import { rollSushi } from "../data/gacha";
import { recordAcquisition } from "../db";
import type { Sushi } from "../types";

const CHEF_IMAGE: ImageSourcePropType = require("../../assets/character/chef.png");

export default function TimerScreen() {
  const { isRunning, phase, start, pause, reset, mmss } = usePomodoroTimer({
    focusSeconds: 1,
    autoStartBreak: false,
    onFocusComplete: () => {
      const got = rollSushi();
      recordAcquisition(got.id).catch(() => {});
      setReward(got);
      setRewardOpen(true);
    },
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [reward, setReward] = useState<Sushi | null>(null);

  const handleStart = useCallback(() => {
    if (!isRunning && phase === "focus") {
      start();
    }
  }, [isRunning, phase, start]);

  const onPressExit = useCallback(() => {
    if (isRunning) setConfirmOpen(true);
  }, [isRunning]);

  const keepFocusing = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const confirmExit = useCallback(() => {
    setConfirmOpen(false);
    pause();
    reset();
  }, [pause, reset]);

  const closeReward = useCallback(() => {
    setRewardOpen(false);
  }, []);

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
            style={[
              styles.exitBtn,
              (confirmOpen || rewardOpen) && styles.disabledBtn,
            ]}
            onPress={onPressExit}
            disabled={confirmOpen || rewardOpen}
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
      <RewardModal
        visible={rewardOpen}
        sushi={reward}
        onConfirm={closeReward}
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
    backgroundColor: "#42A5F5",
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
