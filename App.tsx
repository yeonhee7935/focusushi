import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { initNotifications } from "./src/notifications";

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "#FFF8E1" },
};

export default function App() {
  useEffect(() => {
    initNotifications();
  }, []);
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
