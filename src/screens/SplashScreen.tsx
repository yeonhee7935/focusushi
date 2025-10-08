import React, { useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  ImageSourcePropType,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { palette } from "../theme";

const SPLASH_IMAGE: ImageSourcePropType = require("../../assets/character/chef_transparent.png");

export default function SplashScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    let mounted = true;
    const id = setTimeout(() => {
      if (mounted) navigation.replace("Timer");
    }, 1500);
    return () => {
      mounted = false;
      clearTimeout(id);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.bg} />
      <Image source={SPLASH_IMAGE} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: 280, height: 280 },
});
