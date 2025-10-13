import { useMemo, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/types";
import { FOODS } from "../data/foods";
import { useAcquisition } from "../hooks/useAcquisition";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRootNav } from "../navigation/hooks";
import { colors } from "../theme/colors";

type R = RouteProp<RootStackParamList, "ItemDetail">;

function rarityKo(r: string) {
  switch (r) {
    case "COMMON":
      return "보통";
    case "UNCOMMON":
      return "조금 특별";
    case "RARE":
      return "레어";
    case "EPIC":
      return "에픽";
    case "LEGENDARY":
      return "전설";
    case "ULTRA_RARE":
      return "극레어";
    default:
      return r;
  }
}

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

        <Text style={[s.meta, s.metaPill]}>{rarityKo(item.rarity)}</Text>
        <Text style={s.meta}>먹어본 횟수: {ownedCount}</Text>

        <View style={s.section}>
          <Text style={s.sectionTitle}>최근에 받은 초밥</Text>
          {itemLogs.length === 0 ? (
            <Text style={s.empty}>아직 기록이 없어요</Text>
          ) : (
            itemLogs.map((l) => (
              <Text key={l.acquiredAt} style={s.log}>
                {new Date(l.acquiredAt).toLocaleString()}
              </Text>
            ))
          )}
        </View>

        <Pressable style={s.btn} onPress={close} accessibilityRole="button">
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
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: colors.stroke,
  },
  card: {
    width: "86%",
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.stroke,
    alignItems: "center",
  },
  thumb: {
    height: 140,
    borderRadius: 12,
    backgroundColor: "#F7F3EC",
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  title: { fontSize: 22, fontWeight: "800", marginTop: 12, color: colors.ink },
  meta: { color: colors.ink, marginTop: 6, fontSize: 14 },
  metaPill: {
    alignSelf: "flex-start",
    backgroundColor: "#fff2ee",
    borderWidth: 1,
    borderColor: colors.stroke,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: "800",
  },
  section: { marginTop: 18 },
  sectionTitle: { fontSize: 15, fontWeight: "800", marginBottom: 8, color: colors.ink },
  empty: { color: colors.subtitle },
  log: { color: colors.ink, marginTop: 4, fontSize: 14 },
  btn: {
    marginTop: 18,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: colors.primaryTextOn, fontWeight: "800", fontSize: 16 },
});
