import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { FOODS } from "@/data/foods";
import { colors } from "@/theme/colors";

interface SushiWithTime {
  itemId: string;
  acquiredAt: number;
}

interface DayDetailProps {
  date: string;
  items: SushiWithTime[];
  nav: any;
}

export default function DayDetail({ date, items, nav }: DayDetailProps) {
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${year}년 ${month}월 ${day}일`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const sortedItems = [...items].sort((a, b) => a.acquiredAt - b.acquiredAt);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.dateText}>{formatDate(date)}</Text>
        <Text style={s.countText}>초밥 {items.length}개</Text>
      </View>

      <View style={s.list}>
        {sortedItems.map((item, idx) => {
          const foodItem = FOODS.find((f) => f.id === item.itemId);
          if (!foodItem) return null;

          return (
            <Pressable
              key={`${item.itemId}-${item.acquiredAt}-${idx}`}
              style={s.itemCard}
              onPress={() => nav.navigate("ItemDetail", { itemId: foodItem.id })}
            >
              <View style={s.imageContainer}>
                <Image source={foodItem.image} resizeMode="contain" style={s.image} />
              </View>
              <View style={s.info}>
                <Text style={s.name}>{foodItem.name}</Text>
                <Text style={s.time}>{formatTime(item.acquiredAt)}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    margin: 12,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.stroke,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.ink,
  },
  countText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  list: {
    gap: 10,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#fff2ddff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.stroke,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.subtitle,
  },
});
