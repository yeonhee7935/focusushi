// src/navigation/index.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import FocusSessionScreen from "../screens/FocusSessionScreen";
import BreakSheet from "../screens/BreakSheet";
import RewardModal from "../screens/RewardModal";
import ItemDetailModal from "../screens/ItemDetailModal";
import CourseSummaryScreen from "../screens/CourseSummaryScreen";
import { navTheme } from "../theme/navTheme";
import { colors } from "../theme/colors";

export type RootStackParamList = {
  Tabs: undefined;
  FocusSession: undefined;
  BreakSheet: undefined;
  RewardModal: undefined;
  ItemDetail: { itemId: string };
  CourseSummary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#fff" },
          headerShadowVisible: true,
          headerTitleStyle: { color: colors.ink, fontWeight: "800", fontSize: 18 },
          headerTintColor: colors.ink,
          contentStyle: { backgroundColor: colors.surface },
          animation: "fade",
        }}
      >
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="FocusSession"
          component={FocusSessionScreen}
          options={{ title: "집중" }}
        />
        <Stack.Screen
          name="CourseSummary"
          component={CourseSummaryScreen}
          options={{ title: "오늘의 기록" }}
        />
        <Stack.Screen
          name="ItemDetail"
          component={ItemDetailModal}
          options={{
            title: "상세",
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="BreakSheet"
          component={BreakSheet}
          options={{
            title: "휴식",
            presentation: "transparentModal",
            animation: "fade_from_bottom",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="RewardModal"
          component={RewardModal}
          options={{
            title: "보상",
            presentation: "transparentModal",
            animation: "fade_from_bottom",
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
