import { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
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
    <Modal visible animationType="fade" transparent statusBarTranslucent onRequestClose={close}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={s.wrap}
      >
        <Pressable style={s.backdrop} onPress={close} />
        <View style={s.card} accessible accessibilityLabel="메뉴 고르기 모달">
          <Text style={s.title}>주문서</Text>
          <Text style={s.subtitle}>아래 내용을 알려주세요. 그에 맞는 요리를 만들어드릴게요.</Text>
          <View style={s.row}>
            <Text style={s.label}>요리 개수</Text>
            <TextInput
              style={s.input}
              value={planned}
              onChangeText={setPlanned}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="3"
              placeholderTextColor={colors.subtitle}
              accessibilityLabel="요리 개수 입력"
            />
          </View>
          <View style={s.row}>
            <Text style={s.label}>요리 시간 (분)</Text>
            <TextInput
              style={s.input}
              value={focusMin}
              onChangeText={setFocusMin}
              keyboardType="number-pad"
              maxLength={3}
              placeholder="25"
              placeholderTextColor={colors.subtitle}
              accessibilityLabel="요리 시간 입력"
            />
          </View>
          <View style={s.row}>
            <Text style={s.label}>식사 시간 (분)</Text>
            <TextInput
              style={s.input}
              value={breakMin}
              onChangeText={setBreakMin}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="5"
              placeholderTextColor={colors.subtitle}
              accessibilityLabel="식사 시간 입력"
            />
          </View>
          <Pressable
            onPress={onStart}
            disabled={!valid}
            style={[s.cta, !valid && s.ctaDisabled]}
            accessibilityRole="button"
          >
            <Text style={s.ctaText}>{valid ? "주문하기" : "입력을 확인하세요"}</Text>
          </Pressable>
          <Pressable onPress={close} style={s.secondaryBtn}>
            <Text style={s.secondaryText}>돌아가기</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0008",
  },
  card: {
    width: "90%",
    maxWidth: 520,
    backgroundColor: colors.surface,
    padding: 28,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.stroke,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: { fontSize: 20, fontWeight: "800", color: colors.ink, marginBottom: 16 },
  subtitle: { fontSize: 15, color: colors.subtitle, marginBottom: 16 },
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
