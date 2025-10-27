import { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAcquisition } from "../hooks/useAcquisition";
import { useRootNav } from "../navigation/hooks";
import { colors } from "../theme/colors";
import GridView from "@/components/pages/CollectionScreen/GridView";
import CalendarView from "@/components/pages/CollectionScreen/CalendarView";

type ViewMode = "grid" | "calendar";

export default function CollectionScreen() {
  const logs = useAcquisition((s) => s.logs);
  const nav = useRootNav();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const ownedSet = useMemo(() => {
    const s = new Set<string>();
    for (const l of logs) s.add(l.itemId);
    return s;
  }, [logs]);

  return (
    <SafeAreaView style={s.wrap} edges={["top", "left", "right"]}>
      <Text style={s.title}>내가 완성한 초밥들</Text>
      <Text style={s.subtitle}>집중으로 완성한 초밥이 여기에 모여요.</Text>

      <View style={s.toggleContainer}>
        <Pressable
          style={[s.toggleBtn, viewMode === "grid" && s.toggleBtnActive]}
          onPress={() => setViewMode("grid")}
        >
          <Text style={[s.toggleText, viewMode === "grid" && s.toggleTextActive]}>그리드 뷰</Text>
        </Pressable>
        <Pressable
          style={[s.toggleBtn, viewMode === "calendar" && s.toggleBtnActive]}
          onPress={() => setViewMode("calendar")}
        >
          <Text style={[s.toggleText, viewMode === "calendar" && s.toggleTextActive]}>달력 뷰</Text>
        </Pressable>
      </View>

      {viewMode === "grid" ? (
        <GridView ownedSet={ownedSet} nav={nav} />
      ) : (
        <CalendarView logs={logs} nav={nav} />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.surface },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  subtitle: { fontSize: 14, color: colors.subtitle, paddingHorizontal: 16, marginTop: 4 },
  toggleContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.subtitle,
  },
  toggleTextActive: {
    color: colors.ink,
    fontWeight: "800",
  },
});
