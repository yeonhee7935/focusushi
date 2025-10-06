import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SushiCard from "../components/SushiCard";
import { getCollection } from "../db";
import { getSushiList } from "../data/gacha";
import type { OwnedSushi, Sushi, Rarity } from "../types";

type Joined = { sushi: Sushi; count: number };

const rarityOrder: Record<Rarity, number> = {
  common: 0,
  rare: 1,
  epic: 2,
  legendary: 3,
};

export default function CollectionScreen() {
  const [owned, setOwned] = useState<OwnedSushi[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const list = await getCollection();
    setOwned(list);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const joined: Joined[] = useMemo(() => {
    const all = getSushiList(); // 캐시된 전체 목록
    const byId = Object.fromEntries(all.map((s) => [s.id, s]));
    return owned
      .map((o) => (byId[o.id] ? { sushi: byId[o.id], count: o.count } : null))
      .filter((x): x is Joined => !!x)
      .sort((a, b) => {
        // 희귀도 우선, 그 다음 이름
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

  const renderItem = useCallback(
    ({ item }: { item: Joined }) => (
      <SushiCard sushi={item.sushi} count={item.count} style={styles.card} />
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>진열대 / 도감</Text>

      {joined.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>아직 수집한 초밥이 없어요</Text>
          <Text style={styles.emptySubtitle}>
            타이머를 완료하고 초밥을 뽑아보세요!
          </Text>
        </View>
      ) : (
        <FlatList
          data={joined}
          keyExtractor={(item) => item.sushi.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8E1", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF5722",
    textAlign: "center",
    marginVertical: 8,
  },
  listContent: { paddingVertical: 8, paddingBottom: 24 },
  row: { justifyContent: "space-between", marginBottom: 12 },
  card: { width: "48%" },

  empty: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    padding: 24,
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: "#333" },
  emptySubtitle: { marginTop: 6, color: "#666" },
});
