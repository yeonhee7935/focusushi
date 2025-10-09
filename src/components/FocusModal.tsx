// components/FocusModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";

import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { palette } from "../theme";

const IDLE_ASSET = require("../../assets/video/idle.mp4");
const FOCUS_ASSET = require("../../assets/video/focus.mp4");
const SUCCESS_ASSET = require("../../assets/video/success.mp4");

type FocusSessionState = "idle" | "focusing" | "successVideo" | "confirmExit";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function FocusModal({ visible, onClose }: Props) {
  const [focusState, setFocusState] = useState<FocusSessionState>("idle");

  const { start, mmss, reset } = usePomodoroTimer({
    focusSeconds: 10,
    breakSeconds: 10,
    autoStartBreak: false,
    onFocusComplete: () => {
      setFocusState("successVideo");
    },
    onBreakComplete: () => {
      // 1단계에선 휴식 미사용 (다음 단계 예정)
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

  // 성공 영상 종료 감지 (간단/안정)
  const playingEvt = useEvent(successPlayer, "playingChange");
  useEffect(() => {
    if (focusState === "successVideo" && playingEvt?.isPlaying === false) {
      console.log("🎉 성공 영상 종료됨");
      // 다음 단계에서 RewardModal로 연결
    }
  }, [focusState, playingEvt]);

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
    }
  }, [focusState, idlePlayer, focusPlayer, successPlayer]);

  // 모달 열릴 때 집중 시작 / 닫힐 때 초기화
  useEffect(() => {
    if (visible) {
      setFocusState("focusing");
      start();
    } else {
      reset();
      setFocusState("idle");
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.container}>
        {/* 영상 영역: 정방형, 항상 동일 위치 */}
        <View style={styles.mediaBox}>
          {focusState === "successVideo" ? (
            <VideoView player={successPlayer} style={styles.media} />
          ) : focusState === "focusing" ? (
            <VideoView player={focusPlayer} style={styles.media} />
          ) : (
            <VideoView player={idlePlayer} style={styles.media} />
          )}
        </View>

        {/* 타이머: successVideo일 땐 자리 유지 + 숨김 */}
        <Text
          style={[
            styles.timeText,
            focusState === "successVideo" && styles.hidden,
          ]}
        >
          {mmss()}
        </Text>

        {/* 종료(취소) 버튼: focusing일 때만 활성/표시, successVideo일 땐 숨김 */}
        <TouchableOpacity
          onPress={() => {
            if (focusState === "focusing") {
              setFocusState("confirmExit"); // 다음 단계에서 ConfirmExitModal 연결
              console.log("종료 확인 모달 표시 예정");
            }
          }}
          disabled={focusState !== "focusing"}
          style={[styles.exitBtn, focusState !== "focusing" && styles.hidden]}
        >
          <Text style={styles.exitText}>종료</Text>
        </TouchableOpacity>
      </View>
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
  media: {
    width: "100%",
    height: "100%",
  },
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
    opacity: 0, // visibility: hidden 대용 (공간 유지)
  },
});
