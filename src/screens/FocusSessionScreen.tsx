import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCourse } from "../hooks/useCourse";
import { useSnapshotPersistence } from "../hooks/useSnapshot";
import { formatMMSS } from "../utils/time";

export default function FocusSessionScreen() {
  const nav = useNavigation();
  const { current, completeSession, endCourse } = useCourse();
  const focusMs = current?.focusMs ?? 0;

  const [remaining, setRemaining] = useState(focusMs);
  const [paused, setPaused] = useState(false);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!current) return;
    setRemaining(focusMs);
  }, [current, focusMs]);

  useEffect(() => {
    if (!current) return;
    if (paused) {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    tickRef.current && clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setRemaining((ms) => Math.max(0, ms - 1000));
    }, 1000);
    return () => {
      tickRef.current && clearInterval(tickRef.current);
    };
  }, [paused, current]);

  useEffect(() => {
    if (!current) return;
    if (remaining === 0) {
      tickRef.current && clearInterval(tickRef.current);
      completeSession().then(() => {
        // @ts-expect-error generic nav
        nav.navigate("RewardModal");
      });
    }
  }, [remaining, current, completeSession, nav]);

  useSnapshotPersistence(
    useCallback(() => {
      if (!current) return undefined;
      return {
        mode: "FOCUS",
        remainingMs: remaining,
        courseId: current.id,
        savedAt: Date.now(),
      };
    }, [current, remaining]),
  );

  const onEnd = useCallback(() => {
    if (!current) return;
    Alert.alert("코스 종료", "지금까지 진행한 세션만 저장합니다.", [
      { text: "취소", style: "cancel" },
      {
        text: "종료",
        style: "destructive",
        onPress: async () => {
          tickRef.current && clearInterval(tickRef.current);
          await endCourse();
          // @ts-expect-error generic nav
          nav.navigate("CourseSummary");
        },
      },
    ]);
  }, [current, endCourse, nav]);

  if (!current) {
    return (
      <View style={s.center}>
        <Text style={s.title}>진행 중인 코스가 없습니다</Text>
        <Pressable style={s.cta} onPress={() => nav.goBack()}>
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
        <Text style={s.timer}>{formatMMSS(remaining)}</Text>
        <View style={s.row}>
          <Pressable
            style={[s.btn, paused ? s.primary : s.secondary]}
            onPress={() => setPaused(!paused)}
          >
            <Text style={paused ? s.btnTextPrimary : s.btnTextSecondary}>
              {paused ? "재개" : "일시정지"}
            </Text>
          </Pressable>
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
