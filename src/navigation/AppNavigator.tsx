import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TimerScreen from "../screens/TimerScreen";
import CollectionScreen from "../screens/CollectionScreen";

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "#000" },
};

export default function AppNavigator() {
  const insets = useSafeAreaInsets(); // ✅ 하단 안전 영역

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#8b8b8b",
          tabBarHideOnKeyboard: true, // ✅ 선택: 키보드 시 숨김
          tabBarStyle: {
            backgroundColor: "#111",
            borderTopColor: "transparent",
            // ✅ 안전 영역을 반영해 겹침 방지
            height: 56 + insets.bottom,
            paddingBottom: 8 + insets.bottom,
            paddingTop: 8,
          },
          tabBarIcon: ({ color, size }) => {
            const map: Record<string, keyof typeof Ionicons.glyphMap> = {
              Timer: "timer-outline",
              Collection: "albums-outline",
              Stats: "bar-chart-outline",
              Settings: "settings-outline",
            };
            return (
              <Ionicons
                name={map[route.name] ?? "ellipse"}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name="Timer"
          component={TimerScreen}
          options={{ title: "집중" }}
        />
        <Tab.Screen
          name="Collection"
          component={CollectionScreen}
          options={{ title: "컬렉션" }}
        />
        {/* 필요 시 추가 탭 */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
