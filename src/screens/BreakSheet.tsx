import { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCourse } from "../hooks/useCourse";
import { formatMMSS } from "../utils/time";
import { cancelNotification, scheduleLocal } from "../lib/notifications";
import { colors } from "../theme/colors";

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
        <Text style={s.title}>휴식 중</Text>
        <Text style={s.subtitle}>물 한 모금하고, 숨 고를까요?</Text>
        <Text style={s.timer}>{formatMMSS(remaining)}</Text>

        <Pressable style={[s.btn, s.primary]} onPress={onClose}>
          <Text style={s.btnTextPrimary}>다음 세션 시작</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  dim: { flex: 1, backgroundColor: "#0006", alignItems: "center", justifyContent: "flex-end" },
  sheet: {
    width: "100%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 26,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.stroke,
  },
  title: { fontSize: 20, fontWeight: "800", color: colors.ink },
  subtitle: { fontSize: 15, color: colors.subtitle, marginTop: 6, marginBottom: 10 },
  timer: { fontSize: 48, fontWeight: "800", marginBottom: 18, color: colors.ink },
  btn: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  btnTextPrimary: { color: colors.primaryTextOn, fontWeight: "800", fontSize: 16 },
});
