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
import { Ionicons } from "@expo/vector-icons";
import { FOODS } from "@/data/foods";
import type { FoodItem, Rarity, FoodCategory } from "@/data/types";
import { colors } from "@/theme/colors";

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

interface GridViewProps {
  ownedSet: Set<string>;
  nav: any;
}

export default function GridView({ ownedSet, nav }: GridViewProps) {
  const [raritySet, setRaritySet] = useState<Set<Rarity>>(new Set());
  const [categorySet, setCategorySet] = useState<Set<FoodCategory>>(new Set());

  const { width: screenW } = useWindowDimensions();
  const H_PADDING = 12;
  const GAP = 12;
  const COLUMNS = 3;
  const cardWidth = (screenW - H_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

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
  }, [filtered]);

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
    <FlatList
      data={data}
      keyExtractor={(it) => it.id}
      numColumns={3}
      columnWrapperStyle={[s.col, { gap: GAP }]}
      renderItem={renderItem}
      contentContainerStyle={[s.list, { paddingHorizontal: H_PADDING, gap: GAP }]}
    />
  );
}

const s = StyleSheet.create({
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
