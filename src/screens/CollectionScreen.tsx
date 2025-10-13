import { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FOODS } from "../data/foods";
import { useAcquisition } from "../hooks/useAcquisition";
import type { FoodItem, Rarity, FoodCategory } from "../data/types";
import { useRootNav } from "../navigation/hooks";
import { colors } from "../theme/colors";

type SortKey = "OWNED" | "RARITY" | "NAME";
const RARITIES: Array<Rarity> = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "ULTRA_RARE"];
const CATEGORIES: Array<FoodCategory> = ["SUSHI", "DESSERT", "APPETIZER"];

function sortLabel(k: SortKey) {
  return k === "OWNED" ? "먹어본 순" : k === "RARITY" ? "희귀도" : "이름";
}
// 표시용 라벨(텍스트만 변경)
function rarityKo(r: Rarity) {
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
  }
}
function categoryKo(c: FoodCategory) {
  switch (c) {
    case "SUSHI":
      return "초밥";
    case "DESSERT":
      return "디저트";
    case "APPETIZER":
      return "사이드";
  }
  return c;
}

export default function CollectionScreen() {
  const logs = useAcquisition((s) => s.logs);
  const nav = useRootNav();

  const [sortKey, setSortKey] = useState<SortKey>("OWNED");
  const [raritySet, setRaritySet] = useState<Set<Rarity>>(new Set());
  const [categorySet, setCategorySet] = useState<Set<FoodCategory>>(new Set());

  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const ownedSet = useMemo(() => {
    const s = new Set<string>();
    for (const l of logs) s.add(l.itemId);
    return s;
  }, [logs]);

  const rarityRank: Record<Rarity, number> = {
    COMMON: 1,
    UNCOMMON: 2,
    RARE: 3,
    EPIC: 4,
    LEGENDARY: 5,
    ULTRA_RARE: 6,
  };

  const filtered = useMemo(() => {
    return FOODS.filter((f) => {
      const rOk = raritySet.size === 0 || raritySet.has(f.rarity);
      const cOk = categorySet.size === 0 || categorySet.has(f.category);
      return rOk && cOk;
    });
  }, [raritySet, categorySet]);

  const data = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (sortKey === "OWNED") {
        const ao = ownedSet.has(a.id) ? 1 : 0;
        const bo = ownedSet.has(b.id) ? 1 : 0;
        if (ao !== bo) return bo - ao;
        if (rarityRank[a.rarity] !== rarityRank[b.rarity])
          return rarityRank[b.rarity] - rarityRank[a.rarity];
        return a.name.localeCompare(b.name);
      }
      if (sortKey === "RARITY") {
        if (rarityRank[a.rarity] !== rarityRank[b.rarity])
          return rarityRank[b.rarity] - rarityRank[a.rarity];
        return a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name);
    });
    return arr;
  }, [filtered, sortKey, ownedSet]);

  const filtersActive = raritySet.size + categorySet.size;
  const clearFilters = () => {
    setRaritySet(new Set());
    setCategorySet(new Set());
  };

  const renderItem = ({ item }: { item: FoodItem }) => {
    const owned = ownedSet.has(item.id);
    return (
      <Pressable
        style={s.card}
        accessibilityRole="button"
        onPress={() => nav.navigate("ItemDetail", { itemId: item.id })}
      >
        <View style={s.thumb} />
        <Text style={s.name} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={s.row}>
          <Badge text={rarityKo(item.rarity)} />
          <OwnedTag owned={owned} />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={s.wrap} edges={["top", "left", "right"]}>
      <Text style={s.title}>내가 먹은 초밥들</Text>
      <Text style={s.subtitle}>집중으로 완성한 초밥이 여기에 모여요.</Text>

      <View style={s.toolbar}>
        <Pressable style={[s.toolBtn, s.primary]} onPress={() => setShowSort(true)}>
          <Text style={s.toolTextPrimary}>정렬: {sortLabel(sortKey)}</Text>
        </Pressable>
        <Pressable style={[s.toolBtn, s.secondary]} onPress={() => setShowFilter(true)}>
          <Text style={s.toolTextSecondary}>고르기</Text>
        </Pressable>
        {filtersActive > 0 && (
          <Pressable style={s.filterChip} onPress={clearFilters} accessibilityLabel="필터 초기화">
            <Text style={s.filterChipText}>필터 {filtersActive} · 초기화</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        numColumns={3}
        columnWrapperStyle={s.col}
        renderItem={renderItem}
        contentContainerStyle={s.list}
      />

      {/* 정렬 */}
      <Modal
        transparent
        visible={showSort}
        animationType="fade"
        onRequestClose={() => setShowSort(false)}
      >
        <Pressable style={s.dim} onPress={() => setShowSort(false)}>
          <View style={s.sheet}>
            {(["OWNED", "RARITY", "NAME"] as SortKey[]).map((k) => (
              <Pressable
                key={k}
                style={s.sheetRow}
                onPress={() => {
                  setSortKey(k);
                  setShowSort(false);
                }}
              >
                <Text style={[s.sheetText, sortKey === k && s.sheetTextOn]}>{sortLabel(k)}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* 필터 */}
      <Modal
        transparent
        visible={showFilter}
        animationType="slide"
        onRequestClose={() => setShowFilter(false)}
      >
        <View style={s.dimBottom}>
          <View style={s.filterSheet}>
            <Text style={s.filterTitle}>희귀도</Text>
            <View style={s.segment}>
              {RARITIES.map((r) => {
                const on = raritySet.has(r);
                return (
                  <Pressable
                    key={r}
                    style={[s.pill, on && s.pillOn]}
                    onPress={() => {
                      const next = new Set(raritySet);
                      on ? next.delete(r) : next.add(r);
                      setRaritySet(next);
                    }}
                  >
                    <Text style={[s.pillText, on && s.pillTextOn]}>{rarityKo(r)}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[s.filterTitle, { marginTop: 12 }]}>종류</Text>
            <View style={s.segment}>
              {CATEGORIES.map((c) => {
                const on = categorySet.has(c);
                return (
                  <Pressable
                    key={c}
                    style={[s.pill, on && s.pillOn]}
                    onPress={() => {
                      const next = new Set(categorySet);
                      on ? next.delete(c) : next.add(c);
                      setCategorySet(next);
                    }}
                  >
                    <Text style={[s.pillText, on && s.pillTextOn]}>{categoryKo(c)}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ height: 12 }} />
            <Pressable style={[s.toolBtn, s.primary]} onPress={() => setShowFilter(false)}>
              <Text style={s.toolTextPrimary}>적용</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Badge({ text }: { text: string | undefined }) {
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
        {owned ? "먹어봄" : "아직"}
      </Text>
    </View>
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

  toolbar: {
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  toolBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  secondary: { backgroundColor: "#fff", borderColor: colors.stroke },
  toolTextPrimary: { color: colors.primaryTextOn, fontWeight: "800", fontSize: 12 },
  toolTextSecondary: { color: colors.ink, fontWeight: "700", fontSize: 12 },
  filterChip: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#ffe9e4",
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  filterChipText: { color: colors.ink, fontWeight: "700", fontSize: 12 },

  list: { padding: 12 },
  col: { gap: 12 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.stroke,
    padding: 10,
    gap: 8,
    minHeight: 150,
  },
  thumb: {
    height: 72,
    borderRadius: 10,
    backgroundColor: "#F7F3EC",
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  name: { fontSize: 14, fontWeight: "800", color: colors.ink },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#fff2ee",
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  badgeText: { fontSize: 11, color: colors.ink, fontWeight: "700" },

  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  tagOn: { backgroundColor: "#eaf8ef", borderColor: "#2ecc71" },
  tagOff: { backgroundColor: "#fafafa", borderColor: colors.stroke },
  tagText: { fontSize: 11, fontWeight: "800" },
  tagTextOn: { color: "#2ecc71" },
  tagTextOff: { color: colors.subtitle },

  dim: { flex: 1, backgroundColor: "#0006", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetRow: { paddingVertical: 14, alignItems: "center" },
  sheetText: { fontSize: 16, color: colors.ink, fontWeight: "800" },
  sheetTextOn: { color: colors.primary },

  dimBottom: { flex: 1, backgroundColor: "#0006", justifyContent: "flex-end" },
  filterSheet: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: colors.stroke,
  },
  segment: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.stroke,
    backgroundColor: "#fff",
  },
  pillOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { fontSize: 12, color: colors.ink, fontWeight: "700" },
  pillTextOn: { color: colors.primaryTextOn },
  filterTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 4,
    color: colors.ink,
  },
});
