import { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCourse } from "../hooks/useCourse";
import { useSettings } from "../hooks/useSettings";
import { colors } from "../theme/colors";

export default function CourseSetupScreen() {
  const nav = useNavigation();
  const createCourse = useCourse((s) => s.createCourse);
  const settings = useSettings((s) => s.settings);

  const [planned, setPlanned] = useState("3");
  const [focusMin, setFocusMin] = useState(String(Math.round(settings.defaultFocusMs / 60000)));
  const [breakMin, setBreakMin] = useState(String(Math.round(settings.defaultBreakMs / 60000)));

  const valid = useMemo(() => {
    const p = Number(planned);
    const f = Number(focusMin);
    const b = Number(breakMin);
    return Number.isFinite(p) && p > 0 && p <= 12 && f >= 0 && f <= 180 && b >= 0 && b <= 60;
  }, [planned, focusMin, breakMin]);

  const onStart = useCallback(async () => {
    if (!valid) return;
    await createCourse({
      plannedSessions: Number(planned),
      focusMs: Number(focusMin) * 60000,
      breakMs: Number(breakMin) * 60000,
    });
    // @ts-expect-error generic nav
    nav.navigate("FocusSession");
  }, [valid, planned, focusMin, breakMin, createCourse, nav]);

  const close = useCallback(() => {
    nav.goBack();
  }, [nav]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={s.wrap}
    >
      <Pressable style={s.backdrop} onPress={close} />
      <View style={s.sheet} accessible accessibilityLabel="Course Setup Sheet">
        <Text style={s.title}>집중 세션 설정</Text>
        <Text style={s.subtitle}>오늘은 몇 접시쯤 완성해볼까요?</Text>

        <View style={s.row}>
          <Text style={s.label}>세션 수 (연속으로 진행)</Text>
          <TextInput
            style={s.input}
            value={planned}
            onChangeText={setPlanned}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="3"
            placeholderTextColor={colors.subtitle}
          />
        </View>

        <View style={s.row}>
          <Text style={s.label}>집중 시간 (분)</Text>
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
          <Text style={s.label}>휴식 시간 (분)</Text>
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

        <Pressable
          onPress={onStart}
          disabled={!valid}
          style={[s.cta, !valid && s.ctaDisabled]}
          accessibilityRole="button"
        >
          <Text style={s.ctaText}>{valid ? "시작하기" : "입력을 확인하세요"}</Text>
        </Pressable>

        <Pressable onPress={close} style={s.secondaryBtn}>
          <Text style={s.secondaryText}>닫기</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "#0005" },
  sheet: {
    backgroundColor: colors.surface,
    padding: 36,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink },
  subtitle: { fontSize: 15, color: colors.subtitle, marginBottom: 18 },
  row: { marginBottom: 14 },
  label: { fontSize: 15, color: colors.ink, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: colors.ink,
  },
  cta: {
    marginTop: 10,
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaDisabled: { backgroundColor: "#ffb8a8" },
  ctaText: { color: colors.primaryTextOn, fontSize: 17, fontWeight: "800" },
  secondaryBtn: { marginTop: 10, alignItems: "center" },
  secondaryText: { color: colors.subtitle, fontSize: 15 },
});
