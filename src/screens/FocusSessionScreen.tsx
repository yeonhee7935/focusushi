import { useCallback, useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Alert, AppState } from "react-native";
import { useCourse } from "../hooks/useCourse";
import { useSnapshotPersistence } from "../hooks/useSnapshot";
import { formatMMSS } from "../utils/time";
import { useRootNav } from "../navigation/hooks";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { cancelNotification, scheduleLocal } from "../lib/notifications";
import { colors } from "../theme/colors";
import { useVideoPlayer, VideoView } from "expo-video";
import { useFeedback } from "../hooks/useFeedback";

export default function FocusSessionScreen() {
  const nav = useRootNav();
  const { current, endCourse } = useCourse();
  const { haptic, sfx } = useFeedback();

  const focusMs = current?.focusMs ?? 0;
  const notifIdRef = useRef<string | null>(null);

  const onComplete = useCallback(() => {
    if (notifIdRef.current) {
      cancelNotification(notifIdRef.current);
      notifIdRef.current = null;
    }
    nav.navigate("RewardModal");
  }, [nav]);

  const timer = usePomodoroTimer(focusMs, onComplete);

  const player = useVideoPlayer(require("../../assets/videos/focus.mp4"), (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    const onFocus = () => {
      if (!current) return;
      if (focusMs > 0) {
        timer.stop();
        timer.start(focusMs);
        haptic("light");
        sfx("start");
      }
    };
    const unsub = nav.addListener?.("focus", onFocus);
    return () => unsub?.();
  }, [nav, current?.id, focusMs, timer, haptic, sfx]);

  useEffect(() => {
    (async () => {
      const state = AppState.currentState;
      if (timer.running && !timer.paused && state !== "active") {
        if (notifIdRef.current) {
          await cancelNotification(notifIdRef.current);
        }
        notifIdRef.current = await scheduleLocal(
          timer.remaining,
          "집중이 끝났어요",
          "초밥을 받아볼까요?",
        );
      } else {
        if (notifIdRef.current) {
          await cancelNotification(notifIdRef.current);
          notifIdRef.current = null;
        }
      }
    })();
  }, [timer.running, timer.paused, timer.remaining]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        if (notifIdRef.current) {
          cancelNotification(notifIdRef.current);
          notifIdRef.current = null;
        }
        if (timer.running && !timer.paused) {
          player.play();
        } else {
          player.pause();
        }
      } else {
        player.pause();
      }
    });
    return () => sub.remove();
  }, [player, timer.running, timer.paused]);

  useEffect(() => {
    const shouldPlay = !!current && focusMs > 0 && timer.running && !timer.paused;
    if (shouldPlay) {
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
    }
  }, [player, current, focusMs, timer.running, timer.paused]);

  useSnapshotPersistence(
    useCallback(() => {
      if (!current) return undefined;
      return {
        mode: "FOCUS",
        remainingMs: timer.remaining,
        courseId: current.id,
        savedAt: Date.now(),
      };
    }, [current, timer.remaining]),
  );

  const onEnd = useCallback(() => {
    if (!current) return;
    Alert.alert("코스 종료", "지금까지 진행한 세션만 저장합니다.", [
      { text: "취소", style: "cancel" },
      {
        text: "종료",
        style: "destructive",
        onPress: async () => {
          timer.stop();
          if (notifIdRef.current) {
            await cancelNotification(notifIdRef.current);
            notifIdRef.current = null;
          }
          await endCourse();
          nav.replace("CourseSummary");
        },
      },
    ]);
  }, [current, endCourse, nav, timer]);

  if (!current) {
    return (
      <View style={s.center}>
        <Text style={s.title}>진행 중인 세션이 없어요</Text>
        <Pressable style={s.cta} onPress={() => nav.navigate("Tabs")}>
          <Text style={s.ctaText}>홈으로 돌아가기</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={s.wrap}>
      <VideoView
        style={s.bgVideo}
        player={player}
        contentFit="cover"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
      <View style={s.center}>
        <Text style={s.badge}>
          {current.completedSessions}/{current.plannedSessions} 세션
        </Text>
        <Text style={s.timer}>{formatMMSS(timer.remaining)}</Text>
        <View style={s.row}>
          {timer.paused ? (
            <Pressable
              style={[s.btn, s.primary]}
              onPress={() => {
                haptic("light");
                timer.resume();
              }}
            >
              <Text style={s.btnTextPrimary}>계속하기</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[s.btn, s.secondary]}
              onPress={() => {
                haptic("light");
                timer.pause();
              }}
            >
              <Text style={s.btnTextSecondary}>잠시 멈추기</Text>
            </Pressable>
          )}
          <Pressable style={[s.btn, s.danger]} onPress={onEnd}>
            <Text style={s.btnTextDanger}>코스 종료</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.surface },
  bgVideo: { ...StyleSheet.absoluteFillObject },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  badge: { fontSize: 14, color: colors.subtitle, marginBottom: 10 },
  timer: { fontSize: 64, fontWeight: "800", letterSpacing: 1, marginBottom: 22, color: colors.ink },
  row: { flexDirection: "row", gap: 12 },
  btn: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  secondary: { backgroundColor: "#fff", borderColor: colors.stroke },
  danger: { backgroundColor: "#fff0f0", borderColor: "#e74c3c" },
  btnTextPrimary: { color: colors.primaryTextOn, fontWeight: "800", fontSize: 16 },
  btnTextSecondary: { color: colors.ink, fontWeight: "700", fontSize: 16 },
  btnTextDanger: { color: "#e74c3c", fontWeight: "700", fontSize: 16 },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 14, color: colors.ink },
  cta: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  ctaText: { color: colors.primaryTextOn, fontWeight: "800", fontSize: 16 },
});
