import { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCourse } from "../hooks/useCourse";
import { formatMMSS } from "../utils/time";
import { cancelNotification, scheduleLocal } from "../lib/notifications";

export default function BreakSheet() {
  const nav = useNavigation();
  const { current } = useCourse();
  const [remaining, setRemaining] = useState(current?.breakMs ?? 0);
  const notifIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!current) return;
    const id = setInterval(() => setRemaining((ms) => Math.max(0, ms - 1000)), 1000);
    (async () => {
      if (notifIdRef.current) await cancelNotification(notifIdRef.current);
      notifIdRef.current = await scheduleLocal(
        remaining,
        "휴식이 끝났어요",
        "다음 세션을 시작해요",
      );
    })();
    return () => {
      clearInterval(id);
      if (notifIdRef.current) cancelNotification(notifIdRef.current);
    };
  }, [current?.id]);

  const onClose = useCallback(async () => {
    if (notifIdRef.current) await cancelNotification(notifIdRef.current);
    nav.goBack();
  }, [nav]);

  useEffect(() => {
    if (remaining <= 0) onClose();
  }, [remaining, onClose]);

  if (!current) return null;

  return (
    <View style={s.dim} accessible accessibilityLabel="Break Sheet">
      <View style={s.sheet}>
        <Text style={s.title}>휴식 시간</Text>
        <Text style={s.timer}>{formatMMSS(remaining)}</Text>

        <Pressable style={[s.btn, s.primary]} onPress={onClose}>
          <Text style={s.btnTextPrimary}>휴식 종료</Text>
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
  btnTextPrimary: { color: "#fff", fontWeight: "700" },
});
