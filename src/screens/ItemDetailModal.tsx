import { useMemo, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/types";
import { FOODS } from "../data/foods";
import { useAcquisition } from "../hooks/useAcquisition";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRootNav } from "../navigation/hooks";

type R = RouteProp<RootStackParamList, "ItemDetail">;

export default function ItemDetailModal() {
  const nav = useRootNav();
  const route = useRoute<R>();
  const logs = useAcquisition((s) => s.logs);

  const item = useMemo(
    () => FOODS.find((f) => f.id === route.params.itemId) ?? null,
    [route.params.itemId],
  );
  const itemLogs = useMemo(
    () =>
      logs
        .filter((l) => l.itemId === route.params.itemId)
        .slice(-5)
        .reverse(),
    [logs, route.params.itemId],
  );
  const ownedCount = useMemo(
    () => logs.filter((l) => l.itemId === route.params.itemId).length,
    [logs, route.params.itemId],
  );

  const close = useCallback(() => nav.goBack(), [nav]);

  if (!item) {
    return (
      <View style={s.dim}>
        <View style={s.card}>
          <Text>아이템을 찾을 수 없습니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.dim}>
      <Pressable style={s.backdrop} onPress={close} />
      <SafeAreaView style={s.sheet} edges={["bottom"]}>
        <View style={s.thumb} />
        <Text style={s.title}>{item.name}</Text>
        <Text style={s.meta}>{item.rarity}</Text>
        <Text style={s.meta}>소유: {ownedCount}</Text>

        <View style={s.section}>
          <Text style={s.sectionTitle}>최근 획득</Text>
          {itemLogs.length === 0 ? (
            <Text style={s.empty}>기록 없음</Text>
          ) : (
            itemLogs.map((l) => (
              <Text key={l.acquiredAt} style={s.log}>
                {new Date(l.acquiredAt).toLocaleString()}
              </Text>
            ))
          )}
        </View>

        <Pressable style={s.btn} onPress={close}>
          <Text style={s.btnText}>닫기</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  dim: { flex: 1, backgroundColor: "#0006", justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  card: {
    width: "86%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  thumb: {
    height: 140,
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 20, fontWeight: "800", marginTop: 12 },
  meta: { color: "#555", marginTop: 4 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 6 },
  empty: { color: "#777" },
  log: { color: "#333", marginTop: 2 },
  btn: {
    marginTop: 16,
    backgroundColor: "#2E86DE",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
