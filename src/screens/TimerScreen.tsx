// screens/TimerScreen.tsx
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import * as Haptics from "expo-haptics";

import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import ConfirmExitModal from "../components/ConfirmExitModal";
import RewardModal from "../components/RewardModal";
import { rollSushi } from "../data/gacha";
import { recordAcquisition } from "../db";
import { notifyFocusSuccess } from "../notifications";
import type { Sushi } from "../types";
import { palette } from "../theme";
import FocusModal from "../components/FocusModal"; // ⭐️ [추가] 1단계 테스트 연결

const IDLE_ASSET = require("../../assets/video/idle.mp4");
const FOCUS_ASSET = require("../../assets/video/focus.mp4");
const SUCCESS_ASSET = require("../../assets/video/success.mp4");

export default function TimerScreen() {
  const { isRunning, phase, start, pause, reset, mmss } = usePomodoroTimer({
    focusSeconds: 10,
    breakSeconds: 10,
    autoStartBreak: false,
    onFocusComplete: () => {
      const got = rollSushi();
      recordAcquisition(got.id).catch(() => {});
      notifyFocusSuccess(`보상: ${got.name}`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setReward(got);
      setShowSuccess(true);
    },
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [reward, setReward] = useState<Sushi | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // ⭐️ [추가] 1단계 테스트용 모달 상태
  const [focusOpen, setFocusOpen] = useState(false);

  const isIdle = !isRunning && phase === "focus" && !showSuccess;
  const isFocusing = isRunning && phase === "focus" && !showSuccess;
  const uiBlocked = confirmOpen || rewardOpen || showSuccess;
  const showExit = isFocusing;

  const idlePlayer = useVideoPlayer(IDLE_ASSET, (p) => {
    p.loop = true;
    p.muted = true;
  });
  const focusPlayer = useVideoPlayer(FOCUS_ASSET, (p) => {
    p.loop = true;
    p.muted = true;
  });
  const successPlayer = useVideoPlayer(SUCCESS_ASSET, (p) => {
    p.loop = false;
    p.muted = true;
  });

  useEffect(() => {
    if (isIdle) {
      idlePlayer.play();
      focusPlayer.pause();
      successPlayer.pause();
    } else if (isFocusing) {
      focusPlayer.play();
      idlePlayer.pause();
      successPlayer.pause();
    } else if (showSuccess) {
      try {
        successPlayer.currentTime = 0;
      } catch {}
      successPlayer.play();
      idlePlayer.pause();
      focusPlayer.pause();
    } else {
      idlePlayer.play();
      focusPlayer.pause();
      successPlayer.pause();
    }
  }, [isIdle, isFocusing, showSuccess, idlePlayer, focusPlayer, successPlayer]);

  const playingEvt = useEvent(successPlayer, "playingChange");

  useEffect(() => {
    if (showSuccess && playingEvt?.isPlaying === false) {
      console.log("끝!");
      setShowSuccess(false);
      setRewardOpen(true);
    }
  }, [showSuccess, playingEvt?.isPlaying]);

  const handleStart = useCallback(() => {
    if (!isRunning) {
      if (phase === "focus") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        start();
      } else if (phase === "break") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        start();
      }
    }
  }, [isRunning, phase, start]);

  const onPressExit = useCallback(() => {
    if (isRunning) {
      Haptics.selectionAsync();
      setConfirmOpen(true);
    }
  }, [isRunning]);

  const keepFocusing = useCallback(() => setConfirmOpen(false), []);
  const confirmExit = useCallback(() => {
    setConfirmOpen(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    pause();
    reset();
  }, [pause, reset]);

  const closeReward = useCallback(() => setRewardOpen(false), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stack}>
        {showSuccess ? (
          <View style={styles.mediaBox}>
            <VideoView
              player={successPlayer}
              style={styles.media}
              nativeControls={false}
              allowsPictureInPicture={false}
              fullscreenOptions={{ enable: false }}
              contentFit="contain"
            />
          </View>
        ) : isFocusing ? (
          <View style={styles.mediaBox}>
            <VideoView
              player={focusPlayer}
              style={styles.media}
              nativeControls={false}
              allowsPictureInPicture={false}
              fullscreenOptions={{ enable: false }}
              contentFit="contain"
            />
          </View>
        ) : (
          <View style={styles.mediaBox}>
            <VideoView
              player={idlePlayer}
              style={styles.media}
              nativeControls={false}
              allowsPictureInPicture={false}
              fullscreenOptions={{ enable: false }}
              contentFit="contain"
            />
          </View>
        )}

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

        {/* ⭐️ [추가] 1단계 테스트용: FocusModal 열기 버튼 */}
        <TouchableOpacity
          style={[styles.startBtn, { marginTop: 16 }]}
          onPress={() => setFocusOpen(true)}
          accessibilityLabel="(임시) 집중 모달 열기"
        >
          <Text style={styles.startText}>(임시) 집중 모달 열기</Text>
        </TouchableOpacity>
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

      {/* ⭐️ [추가] FocusModal 테스트 연결 */}
      <FocusModal visible={focusOpen} onClose={() => setFocusOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bg },
  stack: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    gap: 10,
  },
  mediaBox: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#000",
    borderRadius: 0,
    overflow: "hidden",
  },
  media: { width: "100%", height: "100%" },
  character: { width: "80%", aspectRatio: 1 },
  timeText: {
    fontSize: 32,
    fontWeight: "900",
    color: palette.text,
    marginTop: 4,
  },
  startBtn: {
    marginTop: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: "#42A5F5",
  },
  startText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  exitBtn: {
    marginTop: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: palette.primary,
    borderRadius: 12,
  },
  exitText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  disabledBtn: { opacity: 0.6 },
});
