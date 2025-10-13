import { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

export default function HomeIdleScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onStart = useCallback(() => {
    nav.navigate("CourseSetup");
  }, [nav]);

  return (
    <SafeAreaView style={s.wrap}>
      <View style={s.center}>
        <Text style={s.title}>포커스시</Text>
        <Text style={s.subtitle}>어서 오세요. </Text>
        <Text style={s.subtitle}>초밥을 만들어드릴게요.</Text>

        <Pressable style={s.cta} onPress={onStart} accessibilityRole="button">
          <Text style={s.ctaText}>집중 시작하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 34, fontWeight: "800", color: colors.ink, marginBottom: 16 },
  subtitle: { fontSize: 16, color: colors.subtitle, textAlign: "center" },
  cta: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.stroke,
    minWidth: 220,
    alignItems: "center",
    marginTop: 16,
  },
  ctaText: { color: colors.primaryTextOn, fontSize: 18, fontWeight: "800" },
});
