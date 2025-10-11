import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header">Focusushi v3</Text>
      <Text>구조 세팅 완료. 다음 단계에서 네비/타입/훅을 붙입니다.</Text>
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
