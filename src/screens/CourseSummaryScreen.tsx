import { useMemo, useCallback, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Animated, Easing } from "react-native";
import { CommonActions, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { useCourse } from "../hooks/useCourse";
import { useRootNav } from "@/navigation/hooks";
import { colors } from "../theme/colors";
import type { RootStackParamList } from "../navigation/types";

export default function CourseSummaryScreen() {
  const nav = useRootNav();
  const route = useRoute<RouteProp<RootStackParamList, "CourseSummary">>();
  const history = useCourse((s) => s.history);

  const snap = route.params?.snapshot;
  const finished = Boolean(snap) || history.length > 0;
  const source = snap ?? (history.length ? history[history.length - 1] : null);

  const progress = finished ? `${source!.completedSessions}/${source!.plannedSessions}` : "0/0";
  const acquiredCount = finished ? source!.items.length : 0;
  const focusMin = finished ? Math.round(source!.focusMs / 60000) : 0;
  const breakMin = finished ? Math.round(source!.breakMs / 60000) : 0;

  const goHome = useCallback(() => {
    nav.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Tabs" }],
      }),
    );
  }, [nav]);

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fade]);

  return (
    <View style={s.wrap}>
      <Animated.View style={[s.card, { opacity: fade }]}>
        <Text style={s.title}>오늘의 코스가 완료되었습니다.</Text>
        {finished ? (
          <>
            <Text style={s.subtitle}>
              오늘은 <Text style={s.highlight}>{acquiredCount}</Text>개의 메뉴를 드셨군요.
            </Text>
          </>
        ) : (
          <Text style={s.empty}>아직 코스를 완료하지 않았어요.</Text>
        )}

        <Pressable style={s.cta} onPress={goHome} accessibilityRole="button">
          <Text style={s.ctaText}>처음으로</Text>
        </Pressable>
      </Animated.View>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdfaf6",
  },
  card: {
    width: "88%",
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 22,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.stroke,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    color: colors.ink,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: colors.subtitle,
    marginBottom: 18,
    textAlign: "center",
    lineHeight: 22,
  },
  highlight: { color: colors.primary, fontWeight: "900" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  label: { color: colors.ink, fontSize: 15, fontWeight: "600" },
  value: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  empty: { color: colors.subtitle, marginVertical: 16, fontSize: 14, textAlign: "center" },
  cta: {
    marginTop: 22,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  ctaText: { color: colors.primaryTextOn, fontSize: 17, fontWeight: "800" },
});
