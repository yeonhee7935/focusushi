// components/FocusModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import * as Haptics from "expo-haptics";

import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import ConfirmExitModal from "./../components/ConfirmExitModal";
import RewardModal from "./../components/RewardModal";
import ConfirmBreakModal from "./../components/ConfirmBreakModal";
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
  | "confirmExit"
  | "confirmBreak"
  | "breaking"; // 🆕 휴식 상태 추가

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function FocusModal({ visible, onClose }: Props) {
  const [focusState, setFocusState] = useState<FocusSessionState>("idle");
  const [rewardSushi, setRewardSushi] = useState<Sushi | null>(null);

  // 현재 단계에선 자동휴식 off 가정 (MVP)
  const autoStartBreak = false;

  const { start, pause, reset, skip, mmss } = usePomodoroTimer({
    focusSeconds: 3,
    breakSeconds: 5,
    autoStartBreak, // false: 포커스 종료 후 휴식 자동시작 안 함(사용자 선택)
    onFocusComplete: async () => {
      // 포커스 종료 → 보상 플로우
      const got = rollSushi();
      setRewardSushi(got);
      recordAcquisition(got.id).catch(() => {});
      notifyFocusSuccess(`보상: ${got.name}`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setFocusState("successVideo");
    },
    onBreakComplete: () => {
      // 휴식 완료 → 홈 복귀
      reset();
      setFocusState("idle");
      setTimeout(() => onClose(), 50);
    },
  });

  // 플레이어
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

  // 성공 영상 종료 감지 → reward로
  const successPlayingEvt = useEvent(successPlayer, "playingChange");
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
    } else if (focusState === "breaking") {
      // 휴식 중엔 잔잔한 idle 영상을 사용
      idlePlayer.play();
      focusPlayer.pause();
      successPlayer.pause();
    } else if (
      focusState === "confirmExit" ||
      focusState === "reward" ||
      focusState === "confirmBreak"
    ) {
      // 모달류가 열릴 때는 모두 정지
      idlePlayer.pause();
      focusPlayer.pause();
      successPlayer.pause();
    }
  }, [focusState, idlePlayer, focusPlayer, successPlayer]);

  // 모달 열림/닫힘
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

  // 종료 버튼
  const onPressExit = () => {
    if (focusState === "focusing") {
      pause();
      setFocusState("confirmExit");
    } else if (focusState === "breaking") {
      reset();
      setFocusState("idle");
      setTimeout(() => onClose(), 50);
    }
  };

  // 종료 컨펌
  const keepFocusing = () => {
    setFocusState("focusing");
    start();
  };
  const confirmExit = () => {
    reset();
    setFocusState("idle");
    setTimeout(() => onClose(), 50);
  };

  // 리워드 확인 → 조건부 휴식 모달
  const onConfirmReward = async () => {
    if (autoStartBreak) {
      // 자동 휴식 케이스(현재는 false): 곧장 휴식 시작
      setFocusState("breaking");
      start(); // 휴식 카운트다운 시작
    } else {
      setFocusState("confirmBreak");
    }
  };

  // 휴식 여부 모달 콜백
  const onBreakYes = () => {
    // ✅ 핵심: 모달을 닫지 말고, 휴식 상태로 전환 + 타이머 시작
    setFocusState("breaking");
    // usePomodoroTimer는 포커스 완료 직후 이미 phase를 "break"로 전환해둔다.
    // autoStartBreak=false라 자동 시작은 안 했으므로 여기서 수동으로 시작한다.
    start();
  };
  const onBreakNo = () => {
    // 휴식 없이 홈 복귀
    reset();
    setFocusState("idle");
    skip();
    setTimeout(() => onClose(), 50);
  };

  const showTimer = !(
    focusState === "successVideo" ||
    focusState === "reward" ||
    focusState === "confirmBreak"
  );

  const showExitButton = focusState === "focusing" || focusState === "breaking"; // ✅ 휴식 중에도 노출

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.container}>
        {/* 영상: 정방형, 위치 고정 */}
        <View style={styles.mediaBox}>
          {focusState === "successVideo" ? (
            <VideoView player={successPlayer} style={styles.media} />
          ) : focusState === "focusing" || focusState === "confirmExit" ? (
            <VideoView player={focusPlayer} style={styles.media} />
          ) : focusState === "breaking" ? (
            <VideoView player={idlePlayer} style={styles.media} />
          ) : (
            <VideoView player={idlePlayer} style={styles.media} />
          )}
        </View>

        {/* 타이머: 성공/리워드/컨펌브레이크 상태에서는 숨김, 휴식 중엔 표시 */}
        <Text style={[styles.timeText, !showTimer && styles.hidden]}>
          {mmss()}
        </Text>

        {/* 종료 버튼: focusing에만 활성 (휴식 중엔 기본적으로 숨김) */}
        <TouchableOpacity
          onPress={onPressExit}
          disabled={!showExitButton}
          style={[styles.exitBtn, !showExitButton && styles.hidden]}
          accessibilityLabel="세션 종료"
        >
          <Text style={styles.exitText}>
            {focusState === "breaking" ? "휴식 종료" : "종료"}
          </Text>
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

      {/* 휴식 여부 모달 */}
      <ConfirmBreakModal
        visible={focusState === "confirmBreak"}
        onYes={onBreakYes}
        onNo={onBreakNo}
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
  hidden: { opacity: 0 },
});
