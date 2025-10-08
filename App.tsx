// App.tsx
import "react-native-gesture-handler";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await Asset.fromModule(
          require("./assets/character/chef_transparent.png")
        ).downloadAsync();
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const onLayout = useCallback(async () => {
    if (ready) {
      await SplashScreen.hideAsync();
    }
  }, [ready]);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayout}>
        <AppNavigator />
      </View>
    </SafeAreaProvider>
  );
}
