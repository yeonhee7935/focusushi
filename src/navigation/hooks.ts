import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";

export function useRootNav() {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
}
