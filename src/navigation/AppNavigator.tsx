import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TimerScreen from "../screens/TimerScreen";
import CollectionScreen from "../screens/CollectionScreen";
import { palette } from "../theme";

export type RootStackParamList = {
  Splash: undefined;
  Timer: undefined;
  Collection: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: palette.bg },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Timer"
        screenOptions={{
          headerStyle: { backgroundColor: palette.bg },
          headerTitleStyle: { fontWeight: "800", color: "#FF5722" },
          headerTintColor: "#6D4C41",
        }}
      >
        <Stack.Screen
          name="Timer"
          component={TimerScreen}
          options={({ navigation }) => ({
            title: "집중",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Collection")}
                accessibilityLabel="도감 열기"
                style={{ paddingHorizontal: 8, paddingVertical: 4 }}
              >
                <Text style={{ fontSize: 18 }}>🍣</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Collection"
          component={CollectionScreen}
          options={{ title: "도감" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
