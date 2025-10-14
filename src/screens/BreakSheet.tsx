// src/screens/BreakSheet.tsx
import { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, Pressable, StyleSheet, AppState } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCourse } from "../hooks/useCourse";
import { formatMMSS } from "../utils/time";
import { cancelNotification, scheduleLocal } from "../lib/notifications";
import { useVideoPlayer, VideoView } from "expo-video";

export default function BreakSheet() {
  const nav = useNavigation();
  const { current } = useCourse();
  const [remaining, setRemaining] = useState(current?.breakMs ?? 0);
  const notifIdRef = useRef<string | null>(null);

  const player = useVideoPlayer(require("../../assets/videos/idle.mp4"), (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    if (!current) return;
    const id = setInterval(() => setRemaining((ms) => Math.max(0, ms - 1000)), 1000);
    (async () => {
      if (notifIdRef.current) await cancelNotification(notifIdRef.current);
      const state = AppState.currentState;
      if (state !== "active") {
        notifIdRef.current = await scheduleLocal(
          remaining,
          "휴식이 끝났어요",
          "다음 세션을 시작해요",
        );
      }
    })();
    return () => {
      clearInterval(id);
      if (notifIdRef.current) cancelNotification(notifIdRef.current);
    };
  }, [current?.id]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        if (remaining > 0) player.play();
        else player.pause();
      } else {
        player.pause();
      }
    });
    return () => sub.remove();
  }, [player, remaining]);

  useEffect(() => {
    if (remaining > 0) {
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
    }
  }, [player, remaining]);

  const onClose = useCallback(async () => {
    if (notifIdRef.current) await cancelNotification(notifIdRef.current);
    nav.goBack();
  }, [nav]);

  useEffect(() => {
    if (remaining <= 0) onClose();
  }, [remaining, onClose]);

  if (!current) return null;

  return (
    <View style={s.wrap} accessible accessibilityLabel="Break Fullscreen">
      <VideoView
        style={s.bgVideo}
        player={player}
        contentFit="cover"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
      <View style={s.overlay} />
      <View style={s.center}>
        <Text style={s.title}>휴식 시간</Text>
        <Text style={s.timer}>{formatMMSS(remaining)}</Text>
        <Pressable style={[s.btn, s.primary]} onPress={onClose}>
          <Text style={s.btnTextPrimary}>휴식 종료</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#000" },
  bgVideo: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#00000066" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 12, color: "#fff" },
  timer: { fontSize: 44, fontWeight: "900", marginBottom: 20, color: "#fff" },
  btn: {
    minWidth: 160,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  primary: { backgroundColor: "#2E86DE", borderColor: "#2E86DE" },
  btnTextPrimary: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
