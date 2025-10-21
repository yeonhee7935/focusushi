import { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { useRootNav } from "@/navigation/hooks";

export default function HomeIdleScreen() {
  const nav = useRootNav();

  const onStart = useCallback(() => {
    nav.navigate("CourseSetup");
  }, [nav]);

  return (
    <SafeAreaView style={s.wrap}>
      <View style={s.center}>
        <Pressable style={s.cta} onPress={onStart} accessibilityRole="button">
          <Text style={s.ctaText}>주문하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
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
