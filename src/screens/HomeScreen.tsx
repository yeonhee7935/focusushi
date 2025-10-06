import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { getStats, getHistory, getCollection } from "../db";
import type { Stats } from "../types";

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [todayFocusCount, setTodayFocusCount] = useState(0);
  const [ownedKinds, setOwnedKinds] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, history, collection] = await Promise.all([
        getStats(),
        getHistory(),
        getCollection(),
      ]);

      // 오늘 자정~내일 자정 범위 계산(로컬 타임존 기준)
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const todayCount = history.filter((h) => {
        const t = new Date(h.completedAtISO);
        return t >= start && t < end;
      }).length;

      setStats(s);
      setTodayFocusCount(todayCount);
      setOwnedKinds(collection.length);
    } finally {
      setLoading(false);
    }
  }, []);

  // 화면에 포커스될 때마다 새로고침
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🍣 초밥 포모도로</Text>

      {/* 요약 카드 */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>오늘 포커스</Text>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.summaryValue}>{todayFocusCount}</Text>
          )}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>총 수집 수</Text>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.summaryValue}>
              {stats?.totalCollectedCount ?? 0}
            </Text>
          )}
        </View>

        <View style={[styles.summaryCard, styles.summaryWide]}>
          <Text style={styles.summaryLabel}>보유 종류</Text>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.summaryValue}>{ownedKinds}</Text>
          )}
        </View>
      </View>

      {/* 빠른 이동 */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.primary]}
          onPress={() => navigation.navigate("Timer")}
        >
          <Text style={styles.btnText}>지금 바로 집중하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.secondary]}
          onPress={() => navigation.navigate("Collection")}
        >
          <Text style={styles.btnTextSecondary}>진열대 보러가기</Text>
        </TouchableOpacity>
      </View>
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

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  summaryCard: {
    flexBasis: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryWide: { flexBasis: "100%" },
  summaryLabel: { color: "#6D4C41", fontWeight: "700" },
  summaryValue: {
    marginTop: 6,
    fontSize: 28,
    fontWeight: "900",
    color: "#333",
  },

  actions: { marginTop: 18, gap: 10 },
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: "#FF5722" },
  secondary: { backgroundColor: "#FFE0B2" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  btnTextSecondary: { color: "#6D4C41", fontSize: 16, fontWeight: "800" },
});
