import { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useAcquisition } from "../hooks/useAcquisition";
import { useCourse } from "../hooks/useCourse";
import { drawReward } from "../utils/gacha";
import { FOODS } from "../data/foods";
import type { FoodItem } from "../data/types";
import { useRootNav } from "../navigation/hooks";

export default function RewardModal() {
  const nav = useRootNav();
  const addLog = useAcquisition((s) => s.addLog);
  const { current, completeSession, endCourse } = useCourse();
  const [reward, setReward] = useState<FoodItem | null>(null);
  const [empty, setEmpty] = useState(false);

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
    completeSession({ itemId: res.item.id, acquiredAt });
  }, [current, reward, empty, pool, addLog, completeSession]);

  const onNext = useCallback(() => {
    nav.goBack();
  }, [nav]);

  const onEnd = useCallback(async () => {
    await endCourse();
    nav.replace("CourseSummary");
  }, [endCourse, nav]);

  if (empty) {
    return (
      <View style={s.dim}>
        <View style={s.card}>
          <Text style={s.title}>보상 풀 없음</Text>
          <Text style={{ marginBottom: 16 }}>아이템 목록이 비어 있습니다.</Text>
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
        <Text style={s.title}>보상 획득!</Text>
        <Text style={s.name}>{reward.name}</Text>
        <View style={s.row}>
          <Pressable style={[s.btn, s.primary]} onPress={onNext}>
            <Text style={s.btnTextPrimary}>다음 세션</Text>
          </Pressable>
          <Pressable style={[s.btn, s.secondary]} onPress={onEnd}>
            <Text style={s.btnTextSecondary}>코스 종료</Text>
          </Pressable>

          <Pressable style={[s.btn, s.primary]} onPress={onNext}>
            <Text style={s.btnTextPrimary}>다음 세션</Text>
          </Pressable>
          <Pressable style={[s.btn, s.secondary]} onPress={() => nav.navigate("BreakSheet")}>
            <Text style={s.btnTextSecondary}>휴식하기</Text>
          </Pressable>
          <Pressable style={[s.btn, s.secondary]} onPress={onEnd}>
            <Text style={s.btnTextSecondary}>코스 종료</Text>
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  name: { fontSize: 20, fontWeight: "800", marginBottom: 16 },
  row: { flexDirection: "row", gap: 12 },
  btn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10, borderWidth: 1 },
  primary: { backgroundColor: "#2E86DE", borderColor: "#2E86DE" },
  secondary: { backgroundColor: "#fff", borderColor: "#ddd" },
  btnTextPrimary: { color: "#fff", fontWeight: "700" },
  btnTextSecondary: { color: "#333", fontWeight: "700" },
});
