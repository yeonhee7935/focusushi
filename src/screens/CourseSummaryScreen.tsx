import { useMemo, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { useCourse } from "../hooks/useCourse";
import { useRootNav } from "@/navigation/hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

export default function CourseSummaryScreen() {
  const nav = useRootNav();
  const history = useCourse((s) => s.history);

  const last = useMemo(() => history[history.length - 1] ?? null, [history]);
  const finished = Boolean(last);
  const progress = finished ? `${last!.completedSessions}/${last!.plannedSessions}` : "0/0";
  const acquiredCount = finished ? last!.items.length : 0;
  const focusMin = finished ? Math.round(last!.focusMs / 60000) : 0;
  const breakMin = finished ? Math.round(last!.breakMs / 60000) : 0;

  const goHome = useCallback(() => {
    nav.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Tabs" }],
      }),
    );
  }, [nav]);

  return (
    <SafeAreaView style={s.wrap} edges={["top", "left", "right"]}>
      <View style={s.card}>
        <Text style={s.title}>오늘의 집중 기록</Text>
        {finished ? (
          <>
            <Text style={s.subtitle}>오늘 완성한 초밥: {acquiredCount}개</Text>
            <Row label="세션 진행" value={progress} />
            <Row label="집중 시간(분)" value={String(focusMin)} />
            <Row label="휴식 시간(분)" value={String(breakMin)} />
          </>
        ) : (
          <Text style={s.empty}>아직 요약할 기록이 없어요.</Text>
        )}

        <Pressable style={s.cta} onPress={goHome} accessibilityRole="button">
          <Text style={s.ctaText}>홈으로 돌아가기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.surface,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 6, color: colors.ink },
  subtitle: { fontSize: 14, color: colors.subtitle, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
  label: { color: colors.ink, fontSize: 15, fontWeight: "700" },
  value: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  empty: { color: colors.subtitle, marginVertical: 16, fontSize: 14 },
  cta: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ctaText: { color: colors.primaryTextOn, fontSize: 16, fontWeight: "800" },
});
