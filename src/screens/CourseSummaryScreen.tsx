import { useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  FlatList,
  Image,
  useWindowDimensions,
} from "react-native";
import { CommonActions, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { useCourse } from "../hooks/useCourse";
import { useRootNav } from "@/navigation/hooks";
import { colors } from "../theme/colors";
import type { RootStackParamList } from "../navigation/types";
import { CourseItem } from "@/data/types";
import { FOODS } from "@/data/foods";

const H_PADDING = 12;
const GAP = 12;
const COLUMNS = 3;

function SushiCard({ item }: { item: CourseItem }) {
  const { width: screenW } = useWindowDimensions();
  const cardWidth = (screenW - H_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  const food = FOODS.find((food) => food.id === item.itemId);
  const img = food?.image || require("../../assets/sushi/unknown.png");
  return (
    <View style={[cardStyles.card, { width: cardWidth }]}>
      <View style={s.menuCard}>
        <Image source={img} style={s.menuImage} resizeMode="contain" />
      </View>
      <Text style={s.menuName} numberOfLines={1}>
        {food?.name}
      </Text>
    </View>
  );
}
export default function CourseSummaryScreen() {
  const nav = useRootNav();
  const route = useRoute<RouteProp<RootStackParamList, "CourseSummary">>();
  const history = useCourse((s) => s.history);

  const snap = route.params?.snapshot;
  const finished = Boolean(snap) || history.length > 0;
  const source = snap ?? (history.length ? history[history.length - 1] : null);

  const acquiredCount = finished ? source!.items.length : 0;

  const goHome = useCallback(() => {
    nav.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Tabs" }],
      }),
    );
  }, [nav]);

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fade]);

  const renderItem = ({ item }: { item: CourseItem }) => {
    return <SushiCard item={item} />;
  };
  return (
    <View style={s.wrap}>
      <Animated.View style={[s.card, { opacity: fade }]}>
        <Text style={s.title}>코스 요약</Text>
        {finished ? (
          <>
            <Text style={s.subtitle}>
              <Text style={s.highlight}>{acquiredCount}</Text>개의 메뉴를 드셨군요.
            </Text>
            <FlatList
              data={snap?.items}
              horizontal={true}
              keyExtractor={(item, index) => `${item.itemId}-${index}`}
              renderItem={renderItem}
              contentContainerStyle={[s.list, { paddingHorizontal: H_PADDING, gap: GAP }]}
            />
          </>
        ) : (
          <Text style={s.empty}>아직 코스를 완료하지 않았어요.</Text>
        )}

        <Pressable style={s.cta} onPress={goHome} accessibilityRole="button">
          <Text style={s.ctaText}>처음으로</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdfaf6",
  },
  card: {
    width: "88%",
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 22,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.stroke,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    color: colors.ink,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: colors.subtitle,
    marginBottom: 18,
    textAlign: "center",
    lineHeight: 22,
  },
  highlight: { color: colors.primary, fontWeight: "900" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  label: { color: colors.ink, fontSize: 15, fontWeight: "600" },
  value: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  empty: { color: colors.subtitle, marginVertical: 16, fontSize: 14, textAlign: "center" },
  cta: {
    marginTop: 22,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  ctaText: { color: colors.primaryTextOn, fontSize: 17, fontWeight: "800" },
  menuCard: {
    backgroundColor: "#F7F3EC",
    borderRadius: 12,
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  menuImage: {
    width: "100%",
    height: "100%",
  },
  menuInitial: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.subtitle,
  },
  menuName: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.ink,
    marginTop: 10,
    textAlign: "center",
  },
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
    backgroundColor: "#F7F3EC",
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
