import { DefaultTheme, Theme } from "@react-navigation/native";
import { colors } from "./colors";

export const navTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.surface,
    card: "#fff",
    text: colors.ink,
    border: colors.stroke,
    notification: colors.primary,
  },
};
