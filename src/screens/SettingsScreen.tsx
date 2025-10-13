import { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, Switch, TextInput, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettings } from "../hooks/useSettings";
import { colors } from "../theme/colors";

export default function SettingsScreen() {
  const { settings, setSettings, resetSettings, loaded } = useSettings();
  const [vibration, setVibration] = useState(settings.vibration);
  const [sound, setSound] = useState(settings.sound);
  const [focusMin, setFocusMin] = useState(String(Math.round(settings.defaultFocusMs / 60000)));
  const [breakMin, setBreakMin] = useState(String(Math.round(settings.defaultBreakMs / 60000)));

  const valid = useMemo(() => {
    const f = Number(focusMin),
      b = Number(breakMin);
    return Number.isFinite(f) && f >= 5 && f <= 180 && Number.isFinite(b) && b >= 0 && b <= 60;
  }, [focusMin, breakMin]);

  const onSave = useCallback(() => {
    if (!valid) return;
    setSettings({
      vibration,
      sound,
      defaultFocusMs: Number(focusMin) * 60000,
      defaultBreakMs: Number(breakMin) * 60000,
    });
    Alert.alert("저장 완료", "설정을 반영했어요.");
  }, [valid, vibration, sound, focusMin, breakMin, setSettings]);

  const onReset = useCallback(() => {
    Alert.alert("초기화", "기본값으로 되돌릴까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "초기화",
        style: "destructive",
        onPress: () => {
          resetSettings();
          setVibration(true);
          setSound(true);
          setFocusMin("25");
          setBreakMin("5");
        },
      },
    ]);
  }, [resetSettings]);

  if (!loaded) {
    return (
      <SafeAreaView style={s.wrap}>
        <Text style={s.title}>설정을 불러오는 중…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.wrap} edges={["top", "left", "right"]}>
      <Text style={s.title}>앱 설정</Text>

      <View style={s.card}>
        <View style={s.row}>
          <Text style={s.label}>진동 알림</Text>
          <Switch value={vibration} onValueChange={setVibration} />
        </View>

        <View style={s.row}>
          <Text style={s.label}>사운드 효과</Text>
          <Switch value={sound} onValueChange={setSound} />
        </View>

        <View style={s.row}>
          <Text style={s.label}>기본 집중 시간 (분)</Text>
          <TextInput
            style={s.input}
            value={focusMin}
            onChangeText={setFocusMin}
            keyboardType="number-pad"
            maxLength={3}
            placeholder="25"
            placeholderTextColor={colors.subtitle}
          />
        </View>

        <View style={s.row}>
          <Text style={s.label}>기본 휴식 시간 (분)</Text>
          <TextInput
            style={s.input}
            value={breakMin}
            onChangeText={setBreakMin}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="5"
            placeholderTextColor={colors.subtitle}
          />
        </View>
      </View>

      <Pressable style={[s.btn, valid ? s.primary : s.disabled]} disabled={!valid} onPress={onSave}>
        <Text style={s.btnTextPrimary}>{valid ? "저장" : "입력을 확인하세요"}</Text>
      </Pressable>

      <Pressable style={[s.btn, s.secondary]} onPress={onReset}>
        <Text style={s.btnTextSecondary}>기본값으로 초기화</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.surface, padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 6, color: colors.ink },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  label: { fontSize: 16, color: colors.ink, fontWeight: "700" },
  input: {
    width: 110,
    height: 44,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: "right",
    backgroundColor: "#fff",
    color: colors.ink,
  },
  btn: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  disabled: { backgroundColor: "#ffb5a9", borderColor: "#ffb5a9" },
  secondary: { backgroundColor: "#fff", borderColor: colors.stroke },
  btnTextPrimary: { color: colors.primaryTextOn, fontWeight: "800", fontSize: 16 },
  btnTextSecondary: { color: colors.ink, fontWeight: "700", fontSize: 16 },
});
