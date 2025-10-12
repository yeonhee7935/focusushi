import { useMemo } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { FOODS } from "../data/foods";
import { useAcquisition } from "../hooks/useAcquisition";
import type { FoodItem } from "../data/types";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CollectionScreen() {
  const logs = useAcquisition((s) => s.logs);

  const ownedSet = useMemo(() => {
    const s = new Set<string>();
    for (const l of logs) s.add(l.itemId);
    return s;
  }, [logs]);

  const data = useMemo(() => FOODS, []);

  const renderItem = ({ item }: { item: FoodItem }) => {
    const owned = ownedSet.has(item.id);
    return (
      <Pressable style={s.card} accessibilityRole="button">
        <View style={s.thumb} />
        <Text style={s.name} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={s.row}>
          <Badge text={item.rarity} />
          <OwnedTag owned={owned} />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={s.wrap}>
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        numColumns={3}
        columnWrapperStyle={s.col}
        renderItem={renderItem}
        contentContainerStyle={s.list}
      />
    </SafeAreaView>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <View style={s.badge}>
      <Text style={s.badgeText}>{text}</Text>
    </View>
  );
}

function OwnedTag({ owned }: { owned: boolean }) {
  return (
    <View style={[s.tag, owned ? s.tagOn : s.tagOff]}>
      <Text style={[s.tagText, owned ? s.tagTextOn : s.tagTextOff]}>
        {owned ? "소유" : "미소유"}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#fff" },
  list: { padding: 12 },
  col: { gap: 12 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 10,
    gap: 8,
    minHeight: 140,
  },
  thumb: {
    height: 70,
    borderRadius: 8,
    backgroundColor: "#f4f4f4",
    borderWidth: 1,
    borderColor: "#eee",
  },
  name: { fontSize: 13, fontWeight: "700" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: "#eef4ff" },
  badgeText: { fontSize: 10, color: "#2E86DE", fontWeight: "700" },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  tagOn: { backgroundColor: "#eaf8ef", borderColor: "#2ecc71" },
  tagOff: { backgroundColor: "#fafafa", borderColor: "#ddd" },
  tagText: { fontSize: 10, fontWeight: "700" },
  tagTextOn: { color: "#2ecc71" },
  tagTextOff: { color: "#999" },
});
