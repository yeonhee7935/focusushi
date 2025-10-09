import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SushiCard from "../components/SushiCard";
import SushiDetailModal from "../components/SushiDetailModal";
import { getCollection } from "../db";
import { getSushiList } from "../data/gacha";
import type { OwnedSushi, Sushi, Rarity } from "../types";

const rarityOrder: Record<Rarity, number> = {
  common: 0,
  rare: 1,
  epic: 2,
  legendary: 3,
};

type Joined = {
  sushi: Sushi;
  count: number;
  locked: boolean;
};

export default function CollectionScreen() {
  const [owned, setOwned] = useState<OwnedSushi[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<Joined | null>(null);

  const load = useCallback(async () => {
    const col = await getCollection();
    setOwned(col);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const joined: Joined[] = useMemo(() => {
    const all = getSushiList();
    const ownedMap = new Map<string, number>(owned.map((o) => [o.id, o.count]));

    return all
      .map((s) => {
        const count = ownedMap.get(s.id) ?? 0;
        return { sushi: s, count, locked: count <= 0 };
      })
      .sort((a, b) => {
        const r = rarityOrder[b.sushi.rarity] - rarityOrder[a.sushi.rarity];
        if (r !== 0) return r;
        return a.sushi.name.localeCompare(b.sushi.name, "ko");
      });
  }, [owned]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const openDetail = useCallback((item: Joined) => setSelected(item), []);
  const closeDetail = useCallback(() => setSelected(null), []);

  const renderItem = useCallback(
    ({ item }: { item: Joined }) => (
      <SushiCard
        sushi={item.sushi}
        count={item.count}
        locked={item.locked}
        onPress={() => openDetail(item)}
        style={styles.card}
      />
    ),
    [openDetail]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>내 초밥 컬렉션</Text>

      <FlatList
        data={joined}
        keyExtractor={(item) => item.sushi.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>아직 수집한 초밥이 없어요</Text>
            <Text style={styles.emptySubtitle}>
              타이머를 완료하고 초밥을 뽑아보세요!
            </Text>
          </View>
        }
      />

      {selected && (
        <SushiDetailModal
          visible={!!selected}
          onClose={closeDetail}
          sushi={selected.sushi}
          locked={selected.locked}
          count={selected.count}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 16 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  listContent: { paddingVertical: 8, paddingBottom: 24 },
  row: { justifyContent: "space-between", marginBottom: 16, gap: 16 },
  card: { width: "30%" },
  empty: {
    flex: 1,
    backgroundColor: "#272727ff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    padding: 24,
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: "#fff" },
  emptySubtitle: { marginTop: 6, color: "#aaa" },
});
