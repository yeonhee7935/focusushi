// src/screens/FocusSessionScreen.tsx
import { useCallback, useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Alert, AppState } from "react-native";
import { useCourse } from "../hooks/useCourse";
import { useSnapshotPersistence } from "../hooks/useSnapshot";
import { formatMMSS } from "../utils/time";
import { useRootNav } from "../navigation/hooks";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { cancelNotification, scheduleLocal } from "../lib/notifications";
import { colors } from "../theme/colors";

export default function FocusSessionScreen() {
  const nav = useRootNav();
  const { current, endCourse } = useCourse();

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

  useEffect(() => {
    if (!current) return;
    if (current.completedSessions >= current.plannedSessions) {
      timer.stop();
      if (notifIdRef.current) cancelNotification(notifIdRef.current);
      nav.replace("CourseSummary");
    }
  }, [current?.completedSessions, current?.plannedSessions, nav, timer]);

  useEffect(() => {
    const onFocus = () => {
      if (!current) return;
      if (current.completedSessions >= current.plannedSessions) {
        timer.stop();
        if (notifIdRef.current) cancelNotification(notifIdRef.current);
        nav.replace("CourseSummary");
        return;
      }
      if (focusMs > 0) {
        timer.stop();
        timer.start(focusMs);
      }
    };
    const unsub = nav.addListener?.("focus", onFocus);
    return () => unsub?.();
  }, [nav, current?.id, current?.completedSessions, current?.plannedSessions, focusMs, timer, nav]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && notifIdRef.current) {
        cancelNotification(notifIdRef.current);
        notifIdRef.current = null;
      }
    });
    return () => sub.remove();
  }, []);

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
      <View style={s.center}>
        <Text style={s.badge}>
          {current.completedSessions}/{current.plannedSessions} 세션
        </Text>
        <Text style={s.timer}>{formatMMSS(timer.remaining)}</Text>
        <View style={s.row}>
          {timer.paused ? (
            <Pressable style={[s.btn, s.primary]} onPress={timer.resume}>
              <Text style={s.btnTextPrimary}>계속하기</Text>
            </Pressable>
          ) : (
            <Pressable style={[s.btn, s.secondary]} onPress={timer.pause}>
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
