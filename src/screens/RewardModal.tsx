// src/screens/RewardModal.tsx
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useAcquisition } from "../hooks/useAcquisition";
import { useCourse } from "../hooks/useCourse";
import { drawReward } from "../utils/gacha";
import { FOODS } from "../data/foods";
import type { FoodItem } from "../data/types";
import { useRootNav } from "../navigation/hooks";
import { colors } from "../theme/colors";

export default function RewardModal() {
  const nav = useRootNav();
  const addLog = useAcquisition((s) => s.addLog);
  const { current, completeSession, endCourse } = useCourse();

  const [reward, setReward] = useState<FoodItem | null>(null);
  const [empty, setEmpty] = useState(false);
  const [willFinish, setWillFinish] = useState(false);
  const endingRef = useRef(false);

  const pool = useMemo(() => FOODS, []);

  useEffect(() => {
    if (!current || reward || empty) return;
    const res = drawReward(pool);
    if (!res) {
      setEmpty(true);
      return;
    }
    setReward(res.item);
    const acquiredAt = Date.now();
    addLog(res.item);
    const nextWillFinish = current.completedSessions + 1 >= current.plannedSessions;
    setWillFinish(nextWillFinish);
    completeSession({ itemId: res.item.id, acquiredAt });
  }, [current, reward, empty, pool, addLog, completeSession]);

  const finishedFromStore = current ? current.completedSessions >= current.plannedSessions : false;
  const finishedUI = willFinish || finishedFromStore;

  const onNext = useCallback(async () => {
    if (!current) return;
    if (finishedUI) {
      if (endingRef.current) return;
      endingRef.current = true;
      await endCourse();
      nav.replace("CourseSummary");
      return;
    }
    nav.goBack();
  }, [current, finishedUI, endCourse, nav]);

  const onBreak = useCallback(() => {
    if (finishedUI) return;
    nav.navigate("BreakSheet");
  }, [finishedUI, nav]);

  const onEnd = useCallback(async () => {
    if (endingRef.current) return;
    endingRef.current = true;
    await endCourse();
    nav.replace("CourseSummary");
  }, [endCourse, nav]);

  if (empty) {
    return (
      <View style={s.dim}>
        <View style={s.card}>
          <Text style={s.title}>준비된 초밥이 없어요</Text>
          <Text style={s.subtitle}>다음에 다시 받아볼까요?</Text>
          <Pressable style={[s.btn, s.secondary]} onPress={onEnd}>
            <Text style={s.btnTextSecondary}>코스 종료</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!reward) {
    return (
      <View style={s.dim}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={s.dim} accessible accessibilityLabel="Reward Modal">
      <View style={s.card}>
        <Text style={s.title}>초밥이 나왔습니다!</Text>
        <Text style={s.name}>{reward.name}</Text>

        <View style={s.row}>
          {!finishedUI && (
            <Pressable style={[s.btn, s.primary]} onPress={onNext}>
              <Text style={s.btnTextPrimary}>다음 세션 진행</Text>
            </Pressable>
          )}
          {!finishedUI && (
            <Pressable style={[s.btn, s.secondary]} onPress={onBreak}>
              <Text style={s.btnTextSecondary}>잠깐 쉬기</Text>
            </Pressable>
          )}
          <Pressable style={[s.btn, s.tertiary]} onPress={onEnd}>
            <Text style={s.btnTextTertiary}>코스 종료</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  dim: { flex: 1, backgroundColor: "#0006", alignItems: "center", justifyContent: "center" },
  card: {
    width: "86%",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
    color: colors.ink,
    textAlign: "center",
  },
  subtitle: { fontSize: 15, color: colors.subtitle, marginBottom: 14, textAlign: "center" },
  name: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 18,
    color: colors.ink,
    textAlign: "center",
  },
  row: { flexDirection: "row", gap: 12, flexWrap: "wrap", justifyContent: "center" },
  btn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 120,
    alignItems: "center",
  },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  secondary: { backgroundColor: "#fff", borderColor: colors.stroke },
  tertiary: { backgroundColor: "#fff", borderColor: colors.stroke },
  btnTextPrimary: { color: colors.primaryTextOn, fontWeight: "800", fontSize: 16 },
  btnTextSecondary: { color: colors.ink, fontWeight: "700", fontSize: 16 },
  btnTextTertiary: { color: colors.subtitle, fontWeight: "700", fontSize: 16 },
});
