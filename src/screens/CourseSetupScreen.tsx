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
    return Number.isFinite(p) && p > 0 && p <= 12 && f >= 5 && f <= 180 && b >= 0 && b <= 60;
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
        <Text style={s.title}>코스 설정</Text>

        <View style={s.row}>
          <Text style={s.label}>연속 세션 수</Text>
          <TextInput
            style={s.input}
            value={planned}
            onChangeText={setPlanned}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="3"
          />
        </View>

        <View style={s.row}>
          <Text style={s.label}>집중 시간(분)</Text>
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
          <Text style={s.label}>휴식 시간(분)</Text>
          <TextInput
            style={s.input}
            value={breakMin}
            onChangeText={setBreakMin}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="5"
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
          <Text style={s.secondaryText}>취소</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "#0006" },
  sheet: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  row: { marginBottom: 12 },
  label: { fontSize: 13, color: "#444", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  cta: {
    marginTop: 8,
    backgroundColor: "#2E86DE",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaDisabled: { backgroundColor: "#a8c7ef" },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryBtn: { marginTop: 8, alignItems: "center" },
  secondaryText: { color: "#666" },
});
