import { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, Switch, TextInput, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettings } from "../hooks/useSettings";

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
    Alert.alert("저장됨", "설정이 저장되었습니다.");
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
        <Text style={s.title}>설정 로딩중…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.wrap} edges={["top", "left", "right"]}>
      <Text style={s.title}>설정</Text>

      <View style={s.row}>
        <Text style={s.label}>진동</Text>
        <Switch value={vibration} onValueChange={setVibration} />
      </View>

      <View style={s.row}>
        <Text style={s.label}>사운드</Text>
        <Switch value={sound} onValueChange={setSound} />
      </View>

      <View style={s.row}>
        <Text style={s.label}>기본 집중 시간(분)</Text>
        <TextInput
          style={s.input}
          value={focusMin}
          onChangeText={setFocusMin}
          keyboardType="number-pad"
          maxLength={3}
          placeholder="25"
        />
      </View>

      <View style={s.row}>
        <Text style={s.label}>기본 휴식 시간(분)</Text>
        <TextInput
          style={s.input}
          value={breakMin}
          onChangeText={setBreakMin}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="5"
        />
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
  wrap: { flex: 1, backgroundColor: "#fff", padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 14, color: "#333" },
  input: {
    width: 100,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: "right",
  },
  btn: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  primary: { backgroundColor: "#2E86DE", borderColor: "#2E86DE" },
  disabled: { backgroundColor: "#a8c7ef", borderColor: "#a8c7ef" },
  secondary: { backgroundColor: "#fff", borderColor: "#ddd" },
  btnTextPrimary: { color: "#fff", fontWeight: "700" },
  btnTextSecondary: { color: "#333", fontWeight: "700" },
});
