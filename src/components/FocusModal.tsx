// components/FocusModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import * as Haptics from "expo-haptics";

import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import ConfirmExitModal from "./../components/ConfirmExitModal";
import RewardModal from "./../components/RewardModal";
import { rollSushi } from "../data/gacha";
import { recordAcquisition } from "../db";
import { notifyFocusSuccess } from "../notifications";
import type { Sushi } from "../types";
import { palette } from "../theme";

const IDLE_ASSET = require("../../assets/video/idle.mp4");
const FOCUS_ASSET = require("../../assets/video/focus.mp4");
const SUCCESS_ASSET = require("../../assets/video/success.mp4");

type FocusSessionState =
  | "idle"
  | "focusing"
  | "successVideo"
  | "reward"
  | "confirmExit";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function FocusModal({ visible, onClose }: Props) {
  const [focusState, setFocusState] = useState<FocusSessionState>("idle");
  const [rewardSushi, setRewardSushi] = useState<Sushi | null>(null);

  const { start, pause, reset, mmss } = usePomodoroTimer({
    focusSeconds: 10,
    breakSeconds: 10,
    autoStartBreak: false,
    onFocusComplete: async () => {
      // 1) 보상 추첨 및 저장/알림
      const got = rollSushi();
      setRewardSushi(got);
      recordAcquisition(got.id).catch(() => {});
      notifyFocusSuccess(`보상: ${got.name}`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // 2) 성공 영상으로 전환
      setFocusState("successVideo");
    },
    onBreakComplete: () => {
      // 다음 단계에서 break 플로우 연결
    },
  });

  // 영상 플레이어 3종
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

  // 성공/종료 감지
  const successPlayingEvt = useEvent(successPlayer, "playingChange");

  // 성공 영상 끝나면 → 리워드 모달로
  useEffect(() => {
    if (
      focusState === "successVideo" &&
      successPlayingEvt?.isPlaying === false
    ) {
      setFocusState("reward");
    }
  }, [focusState, successPlayingEvt]);

  // 상태별 영상 제어
  useEffect(() => {
    if (focusState === "idle") {
      idlePlayer.play();
      focusPlayer.pause();
      successPlayer.pause();
    } else if (focusState === "focusing") {
      focusPlayer.play();
      idlePlayer.pause();
      successPlayer.pause();
    } else if (focusState === "successVideo") {
      try {
        successPlayer.currentTime = 0;
      } catch {}
      successPlayer.play();
      idlePlayer.pause();
      focusPlayer.pause();
    } else if (focusState === "confirmExit" || focusState === "reward") {
      // 모달/보상 표시 중에는 영상 정지
      idlePlayer.pause();
      focusPlayer.pause();
      successPlayer.pause();
    }
  }, [focusState, idlePlayer, focusPlayer, successPlayer]);

  // 모달 열림/닫힘에 따른 타이머 제어
  useEffect(() => {
    if (visible) {
      setFocusState("focusing");
      start();
    } else {
      reset();
      setFocusState("idle");
      setRewardSushi(null);
    }
  }, [visible]);

  // 종료 버튼 → 컨펌 모달
  const onPressExit = () => {
    if (focusState === "focusing") {
      pause();
      setFocusState("confirmExit");
    }
  };

  // ConfirmExitModal 콜백
  const keepFocusing = () => {
    setFocusState("focusing");
    start();
  };

  const confirmExit = () => {
    reset();
    setFocusState("idle");
    // 모달 닫기(레이스 방지용 살짝 지연 가능)
    setTimeout(() => onClose(), 50);
  };

  // RewardModal 확인 → 이번 단계에서는 홈으로 복귀
  const onConfirmReward = async () => {
    reset();
    setRewardSushi(null);
    setFocusState("idle");
    setTimeout(() => onClose(), 50);
    // ▶ 다음 단계(5)에서: autoStartBreak 체크 → confirmBreak로 전환 예정
  };

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.container}>
        {/* 영상: 정방형, 위치 고정 */}
        <View style={styles.mediaBox}>
          {focusState === "successVideo" ? (
            <VideoView player={successPlayer} style={styles.media} />
          ) : focusState === "focusing" || focusState === "confirmExit" ? (
            <VideoView player={focusPlayer} style={styles.media} />
          ) : (
            <VideoView player={idlePlayer} style={styles.media} />
          )}
        </View>

        {/* 타이머: 성공/리워드 상태에서는 숨김(자리 유지) */}
        <Text
          style={[
            styles.timeText,
            (focusState === "successVideo" || focusState === "reward") &&
              styles.hidden,
          ]}
        >
          {mmss()}
        </Text>

        {/* 종료 버튼: focusing에만 노출, success/reward/confirmExit에서는 숨김(자리 유지) */}
        <TouchableOpacity
          onPress={onPressExit}
          disabled={focusState !== "focusing"}
          style={[styles.exitBtn, focusState !== "focusing" && styles.hidden]}
          accessibilityLabel="세션 종료"
        >
          <Text style={styles.exitText}>종료</Text>
        </TouchableOpacity>
      </View>

      {/* 종료 확인 모달 */}
      <ConfirmExitModal
        visible={focusState === "confirmExit"}
        onKeep={keepFocusing}
        onExit={confirmExit}
      />

      {/* 리워드 모달 */}
      <RewardModal
        visible={focusState === "reward"}
        sushi={rewardSushi}
        onConfirm={onConfirmReward}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mediaBox: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
  },
  media: { width: "100%", height: "100%" },
  timeText: {
    fontSize: 32,
    fontWeight: "900",
    color: palette.text,
    marginTop: 12,
  },
  exitBtn: {
    marginTop: 12,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: palette.primary,
    borderRadius: 12,
  },
  exitText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  hidden: {
    opacity: 0, // 공간 유지
  },
});
