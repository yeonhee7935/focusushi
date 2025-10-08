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
import { useNavigation } from "@react-navigation/native";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import ConfirmExitModal from "../components/ConfirmExitModal";
import RewardModal from "../components/RewardModal";
import { rollSushi } from "../data/gacha";
import { recordAcquisition } from "../db";
import { notifyFocusSuccess } from "../notifications";
import type { Sushi } from "../types";

const CHEF_IMAGE: ImageSourcePropType = require("../../assets/character/chef_transparent.png");

export default function TimerScreen() {
  const navigation = useNavigation<any>();
  const { isRunning, phase, start, pause, reset, mmss } = usePomodoroTimer({
    focusSeconds: 10,
    autoStartBreak: false,
    onFocusComplete: () => {
      const sushi = rollSushi();
      recordAcquisition(sushi.id).catch(() => {});
      notifyFocusSuccess("초밥이 완성되었어요!");
      setReward(sushi);
      setRewardOpen(true);
    },
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [reward, setReward] = useState<Sushi | null>(null);

  const uiBlocked = confirmOpen || rewardOpen;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            if (!uiBlocked) navigation.navigate("Collection");
          }}
          disabled={uiBlocked}
          accessibilityLabel="도감 열기"
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            opacity: uiBlocked ? 0.5 : 1,
          }}
        >
          <Text style={{ fontSize: 18 }}>🍣</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, uiBlocked]);

  const handleStart = useCallback(() => {
    if (!isRunning && phase === "focus") start();
  }, [isRunning, phase, start]);

  const onPressExit = useCallback(() => {
    if (isRunning) setConfirmOpen(true);
  }, [isRunning]);

  const keepFocusing = useCallback(() => setConfirmOpen(false), []);
  const confirmExit = useCallback(() => {
    setConfirmOpen(false);
    pause();
    reset();
  }, [pause, reset]);

  const closeReward = useCallback(() => setRewardOpen(false), []);

  const showExit = isRunning;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stack}>
        <Image
          source={CHEF_IMAGE}
          style={styles.character}
          resizeMode="contain"
        />
        <Text style={styles.timeText}>{mmss()}</Text>

        {showExit ? (
          <TouchableOpacity
            style={[styles.exitBtn, uiBlocked && styles.disabledBtn]}
            onPress={onPressExit}
            disabled={uiBlocked}
            accessibilityLabel="세션 종료"
          >
            <Text style={styles.exitText}>종료</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.startBtn, uiBlocked && styles.disabledBtn]}
            onPress={handleStart}
            disabled={uiBlocked}
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
