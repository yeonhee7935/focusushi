import { useMemo, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "@/navigation/types";
import { FOODS } from "@/data/foods";
import { RARITY_WEIGHTS } from "@/data/constants";
import { useAcquisition } from "@/hooks/useAcquisition";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRootNav } from "@/navigation/hooks";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";

type R = RouteProp<RootStackParamList, "ItemDetail">;

export default function ItemDetailModal() {
  const nav = useRootNav();
  const route = useRoute<R>();
  const logs = useAcquisition((s) => s.logs);

  const item = useMemo(
    () => FOODS.find((f) => f.id === route.params.itemId) ?? null,
    [route.params.itemId],
  );
  const locked = useMemo<boolean>(
    () => logs.filter((l) => l.itemId === route.params.itemId).length === 0,
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
        <View style={s.thumb}>
          {locked ? (
            <Ionicons name="lock-closed" size={32} color={colors.subtitle} />
          ) : (
            <Image style={s.image} source={item.image} />
          )}
        </View>
        <Text style={s.title}>{item.name}</Text>
        <View style={s.rarity}>
          <Text style={[s.rarityLabel]}>{RARITY_WEIGHTS[item.rarity]}</Text>
          <Text style={s.rarityDescription}>%의 확률로 얻을 수 있어요!</Text>
        </View>
        <Text style={s.description}>{item.description}</Text>
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
  image: {
    width: "100%",
    height: "100%",
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
  rarity: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,122,255,0.1)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    margin: 16,
  },
  rarityLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#007affff",
    alignSelf: "auto",

    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: "transparent",
  },
  rarityDescription: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "400",
  },
  description: { textAlign: "center" },
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
