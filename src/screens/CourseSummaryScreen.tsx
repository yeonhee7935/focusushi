import { useMemo, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useCourse } from "../hooks/useCourse";
import { useRootNav } from "@/navigation/hooks";

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
    <View style={s.wrap}>
      <View style={s.card}>
        <Text style={s.title}>코스 요약</Text>
        {finished ? (
          <>
            <Row label="진행" value={progress} />
            <Row label="획득 수" value={String(acquiredCount)} />
            <Row label="집중 시간(분)" value={String(focusMin)} />
            <Row label="휴식 시간(분)" value={String(breakMin)} />
          </>
        ) : (
          <Text style={s.empty}>요약할 코스가 없습니다.</Text>
        )}

        <Pressable style={s.cta} onPress={goHome} accessibilityRole="button">
          <Text style={s.ctaText}>홈으로</Text>
        </Pressable>
      </View>
    </View>
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
    backgroundColor: "#fff",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  label: { color: "#666", fontSize: 14 },
  value: { color: "#111", fontSize: 16, fontWeight: "700" },
  empty: { color: "#666", marginVertical: 16 },
  cta: {
    marginTop: 16,
    backgroundColor: "#2E86DE",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
