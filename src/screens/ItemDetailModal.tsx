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
        <Pressable style={s.backdrop} onPress={close} />
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

        <View style={s.rarityContainer}>
          <Text style={[s.rarityLabel]}>{rarityKo(item.rarity)} 등급</Text>
          <Text style={s.meta}>({item.rarity})</Text>
        </View>

        <Text style={s.countText}>총 보유: {ownedCount}개</Text>

        <View style={s.section}>
          {itemLogs.length === 0 ? (
            <Text style={s.empty}>아직 기록이 없어요</Text>
          ) : (
            <View>
              {" "}
              <Text style={s.sectionTitle}>최근에 받은 초밥</Text>
              {itemLogs.map((l) => (
                <Text key={l.acquiredAt} style={s.log}>
                  {new Date(l.acquiredAt).toLocaleString()}
                </Text>
              ))}
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  dim: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 36,
    alignItems: "center",
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
    width: 120,
    height: 120,
    backgroundColor: "#f3f3f3",
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111",
    marginTop: 16,
    textAlign: "center",
  },
  meta: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 0,
  },
  rarityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  rarityLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
    marginRight: 5,
    alignSelf: "auto",
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: "transparent",
  },
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
  countText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginTop: 15,
    marginBottom: 20,
  },
  section: { marginTop: 20, alignItems: "center" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: "#111" },
  empty: { color: "#666", fontSize: 14 },
  log: { color: "#333", marginTop: 4, fontSize: 14 },
  btn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
