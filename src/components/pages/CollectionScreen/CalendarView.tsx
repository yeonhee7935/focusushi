import { useMemo, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { colors } from "@/theme/colors";
import DayDetail from "./DayDetail";
import { AcquisitionLog } from "@/data/types";

interface CalendarViewProps {
  logs: AcquisitionLog[];
  nav: any;
}

interface SushiWithTime {
  itemId: string;
  acquiredAt: number;
}

export default function CalendarView({ logs, nav }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const sushiByDate = useMemo(() => {
    const map = new Map<string, SushiWithTime[]>();

    logs.forEach((log) => {
      const date = new Date(log.acquiredAt);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push({
        itemId: log.itemId,
        acquiredAt: log.acquiredAt,
      });
    });

    return map;
  }, [logs]);

  const markedDates = useMemo(() => {
    const marks: { [key: string]: any } = {};

    sushiByDate.forEach((items, dateKey) => {
      const count = items.length;
      let bgColor = colors.primary + "20";
      if (count >= 5) bgColor = colors.primary + "50";
      else if (count >= 3) bgColor = colors.primary + "40";

      marks[dateKey] = {
        marked: true,
        customStyles: {
          container: {
            backgroundColor: bgColor,
            borderRadius: 8,
          },
          text: {
            color: colors.ink,
            fontWeight: "700",
          },
        },
      };
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        customStyles: {
          ...marks[selectedDate]?.customStyles,
          container: {
            ...marks[selectedDate]?.customStyles?.container,
            borderWidth: 2,
            borderColor: colors.primary,
          },
        },
      };
    }

    return marks;
  }, [sushiByDate, selectedDate]);

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const selectedItems = selectedDate ? sushiByDate.get(selectedDate) || [] : [];

  return (
    <ScrollView style={s.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        markingType="custom"
        theme={{
          backgroundColor: colors.surface,
          calendarBackground: colors.surface,
          textSectionTitleColor: colors.ink,
          selectedDayBackgroundColor: colors.primary,
          todayTextColor: colors.primary,
          dayTextColor: colors.ink,
          textDisabledColor: "#d9d9d9",
          monthTextColor: colors.ink,
          textMonthFontWeight: "800",
          textMonthFontSize: 18,
          arrowColor: colors.primary,
        }}
        style={s.calendar}
      />

      {selectedDate && <DayDetail date={selectedDate} items={selectedItems} nav={nav} />}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendar: {
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.stroke,
    overflow: "hidden",
  },
});
