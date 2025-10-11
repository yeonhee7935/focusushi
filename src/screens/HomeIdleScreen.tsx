import { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

export default function HomeIdleScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onStart = useCallback(() => {
    nav.navigate("CourseSetup");
  }, [nav]);

  return (
    <View style={s.wrap}>
      <View style={s.center}>
        <Text style={s.title}>Focusushi</Text>
        <Text style={s.subtitle}>넌 집중을 해라, 난 초밥을 만들테니</Text>

        <Pressable style={s.cta} onPress={onStart} accessibilityRole="button">
          <Text style={s.ctaText}>Start</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 24 },
  cta: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#2E86DE",
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
