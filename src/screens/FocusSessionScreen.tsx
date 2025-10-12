import { useCallback, useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { useCourse } from "../hooks/useCourse";
import { useSnapshotPersistence } from "../hooks/useSnapshot";
import { formatMMSS } from "../utils/time";
import { useRootNav } from "../navigation/hooks";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { cancelNotification, scheduleLocal } from "../lib/notifications";

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
    if (!current || focusMs <= 0) return;
    timer.start(focusMs);
  }, [current?.id, focusMs]); // start 한 번만

  useEffect(() => {
    // running이면 남은 시간으로 예약, 일시정지/정지면 취소
    (async () => {
      if (timer.running && !timer.paused) {
        if (notifIdRef.current) {
          await cancelNotification(notifIdRef.current);
        }
        notifIdRef.current = await scheduleLocal(
          timer.remaining,
          "집중 시간이 끝났어요",
          "보상을 받아볼까요?",
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
        <Text style={s.title}>진행 중인 코스가 없습니다</Text>
        <Pressable style={s.cta} onPress={() => nav.navigate("Tabs")}>
          <Text style={s.ctaText}>돌아가기</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={s.wrap}>
      <View style={s.center}>
        <Text style={s.badge}>
          {current.completedSessions}/{current.plannedSessions}
        </Text>
        <Text style={s.timer}>{formatMMSS(timer.remaining)}</Text>
        <View style={s.row}>
          {timer.paused ? (
            <Pressable style={[s.btn, s.primary]} onPress={timer.resume}>
              <Text style={s.btnTextPrimary}>재개</Text>
            </Pressable>
          ) : (
            <Pressable style={[s.btn, s.secondary]} onPress={timer.pause}>
              <Text style={s.btnTextSecondary}>일시정지</Text>
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
  wrap: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  badge: { fontSize: 13, color: "#666", marginBottom: 8 },
  timer: { fontSize: 56, fontWeight: "800", letterSpacing: 1, marginBottom: 20 },
  row: { flexDirection: "row", gap: 12 },
  btn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10, borderWidth: 1 },
  primary: { backgroundColor: "#2E86DE", borderColor: "#2E86DE" },
  secondary: { backgroundColor: "#fff", borderColor: "#ddd" },
  danger: { backgroundColor: "#fff0f0", borderColor: "#e74c3c" },
  btnTextPrimary: { color: "#fff", fontWeight: "700" },
  btnTextSecondary: { color: "#333", fontWeight: "700" },
  btnTextDanger: { color: "#e74c3c", fontWeight: "700" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  cta: { backgroundColor: "#2E86DE", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  ctaText: { color: "#fff", fontWeight: "700" },
});
