import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import TimerScreen from "../screens/TimerScreen";
import CollectionScreen from "../screens/CollectionScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF5722",
        tabBarInactiveTintColor: "#8D6E63",
        tabBarStyle: { backgroundColor: "#FFF1D0" },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "홈",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          tabBarLabel: "타이머",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>⏱️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Collection"
        component={CollectionScreen}
        options={{
          tabBarLabel: "도감",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>🍣</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
