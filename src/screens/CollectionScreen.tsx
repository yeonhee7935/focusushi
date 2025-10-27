import { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { FOODS } from "../data/foods";
import { useAcquisition } from "../hooks/useAcquisition";
import type { FoodItem, Rarity, FoodCategory } from "../data/types";
import { useRootNav } from "../navigation/hooks";
import { colors } from "../theme/colors";

function SushiCard({
  item,
  locked,
  width,
  onPress,
}: {
  item: FoodItem;
  locked: boolean;
  width: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[cardStyles.card, { width }]}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}${locked ? ", 잠김" : ""}`}
      testID={`SushiCard_${item.id}`}
    >
      <View style={cardStyles.imageBox}>
        {locked ? (
          <Ionicons name="lock-closed" size={32} color={colors.subtitle} />
        ) : (
          <Image source={item.image} resizeMode="contain" style={cardStyles.image} />
        )}
      </View>
      <Text style={[cardStyles.name, locked && cardStyles.nameLocked]} numberOfLines={1}>
        {item.name}
      </Text>
    </Pressable>
  );
}

export default function CollectionScreen() {
  const logs = useAcquisition((s) => s.logs);
  const nav = useRootNav();
  const [raritySet, setRaritySet] = useState<Set<Rarity>>(new Set());
  const [categorySet, setCategorySet] = useState<Set<FoodCategory>>(new Set());

  const { width: screenW } = useWindowDimensions();
  const H_PADDING = 12;
  const GAP = 12;
  const COLUMNS = 3;
  const cardWidth = (screenW - H_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  const ownedSet = useMemo(() => {
    const s = new Set<string>();
    for (const l of logs) s.add(l.itemId);
    return s;
  }, [logs]);

  const filtered = useMemo(() => {
    return FOODS.filter((f) => {
      const rOk = raritySet.size === 0 || raritySet.has(f.rarity);
      const cOk = categorySet.size === 0 || categorySet.has(f.category);
      return rOk && cOk;
    });
  }, [raritySet, categorySet]);

  const data = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [filtered, ownedSet]);

  const renderItem = ({ item }: { item: FoodItem }) => {
    const locked = !ownedSet.has(item.id);
    return (
      <SushiCard
        item={item}
        locked={locked}
        width={cardWidth}
        onPress={() => nav.navigate("ItemDetail", { itemId: item.id })}
      />
    );
  };

  return (
    <SafeAreaView style={s.wrap} edges={["top", "left", "right"]}>
      <Text style={s.title}>내가 완성한 초밥들</Text>
      <Text style={s.subtitle}>집중으로 완성한 초밥이 여기에 모여요.</Text>

      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        numColumns={3}
        columnWrapperStyle={[s.col, { gap: GAP }]}
        renderItem={renderItem}
        contentContainerStyle={[s.list, { paddingHorizontal: H_PADDING, gap: GAP }]}
      />
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
  list: { paddingTop: 12, paddingBottom: 12 },
  col: { justifyContent: "space-between" },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.stroke,
    padding: 10,
    alignItems: "center",
  },
  imageBox: {
    backgroundColor: "#fff2ddff",
    borderRadius: 12,
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.ink,
    marginTop: 10,
    textAlign: "center",
  },
  nameLocked: {
    color: colors.subtitle,
  },
});
