import { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCourse } from "../hooks/useCourse";
import { formatMMSS } from "../utils/time";

export default function BreakSheet() {
  const nav = useNavigation();
  const { current } = useCourse();
  const [remaining, setRemaining] = useState(current?.breakMs ?? 0);

  useEffect(() => {
    if (!current) return;
    const id = setInterval(() => {
      setRemaining((ms) => Math.max(0, ms - 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [current]);

  const onSkip = useCallback(() => {
    nav.goBack();
  }, [nav]);

  const onEnd = useCallback(() => {
    nav.goBack();
  }, [nav]);

  useEffect(() => {
    if (remaining <= 0) onEnd();
  }, [remaining, onEnd]);

  if (!current) return null;

  return (
    <View style={s.dim} accessible accessibilityLabel="Break Sheet">
      <View style={s.sheet}>
        <Text style={s.title}>휴식 시간</Text>
        <Text style={s.timer}>{formatMMSS(remaining)}</Text>

        <Pressable style={[s.btn, s.primary]} onPress={onEnd}>
          <Text style={s.btnTextPrimary}>휴식 종료</Text>
        </Pressable>
        <Pressable style={[s.btn, s.secondary]} onPress={onSkip}>
          <Text style={s.btnTextSecondary}>건너뛰기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  dim: { flex: 1, backgroundColor: "#0006", alignItems: "center", justifyContent: "flex-end" },
  sheet: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  timer: { fontSize: 40, fontWeight: "800", marginBottom: 20 },
  btn: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primary: { backgroundColor: "#2E86DE", borderColor: "#2E86DE" },
  secondary: { backgroundColor: "#fff", borderColor: "#ddd" },
  btnTextPrimary: { color: "#fff", fontWeight: "700" },
  btnTextSecondary: { color: "#333", fontWeight: "700" },
});
