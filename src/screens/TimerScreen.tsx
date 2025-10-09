// screens/TimerScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AppState,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";

import FocusModal from "../components/FocusModal";
import { palette } from "../theme";
import { useFocusEffect } from "@react-navigation/native";

const IDLE_ASSET = require("../../assets/video/idle.mp4");

export default function TimerScreen() {
  // 홈에서 모달만 여닫는다. 타이머 로직은 FocusModal이 담당.
  const [focusOpen, setFocusOpen] = useState(false);

  // 홈(대기) 배경용 아이들 비디오
  const idlePlayer = useVideoPlayer(IDLE_ASSET, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    // 홈에 있을 땐 항상 아이들 영상이 재생되도록
    if (!focusOpen) {
      idlePlayer.play();
    } else {
      idlePlayer.pause();
    }
  }, [focusOpen, idlePlayer]);

  // ✅ 화면 포커스 기준으로 재생/일시정지
  useFocusEffect(
    useCallback(() => {
      if (!focusOpen) idlePlayer.play();
      return () => {
        // 다른 탭으로 이동(blur) 시 정지
        idlePlayer.pause();
      };
    }, [focusOpen, idlePlayer])
  );

  // ✅ 앱 상태(백그라운드/포그라운드) 복귀 시 재생 보정
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        if (!focusOpen) idlePlayer.play();
      } else {
        idlePlayer.pause();
      }
    });
    return () => sub.remove();
  }, [focusOpen, idlePlayer]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stack}>
        {/* 대기용 정방형 비디오 박스 */}
        <View style={styles.mediaBox}>
          <VideoView
            player={idlePlayer}
            style={styles.media}
            nativeControls={false}
            allowsPictureInPicture={false}
            contentFit="contain"
          />
        </View>

        {/* 안내 텍스트 */}
        <Text style={styles.title}>집중할 준비가 되었냥?</Text>

        {/* 집중 시작 버튼 */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => setFocusOpen(true)}
          accessibilityLabel="집중 시작"
        >
          <Text style={styles.startText}>집중 시작</Text>
        </TouchableOpacity>
      </View>

      {/* 풀스크린 집중 모달 */}
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
    paddingHorizontal: 16,
    gap: 14,
  },
  mediaBox: {
    width: "100%",
    aspectRatio: 1, // 정방형
    backgroundColor: "#000",
    borderRadius: 0,
    overflow: "hidden",
  },
  media: { width: "100%", height: "100%" },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: palette.text,
    marginTop: 8,
  },
  startBtn: {
    marginTop: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: "#42A5F5",
    borderRadius: 12,
  },
  startText: { color: "#fff", fontWeight: "900", fontSize: 16 },
});
