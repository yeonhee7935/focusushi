import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import FocusSessionScreen from "../screens/FocusSessionScreen";
import BreakSheet from "../screens/BreakSheet";
import RewardModal from "../screens/RewardModal";
import ItemDetailModal from "../screens/ItemDetailModal";
import CourseSummaryScreen from "../screens/CourseSummaryScreen";
import CourseSetupScreen from "../screens/CourseSetupScreen";
import { navTheme } from "../theme/navTheme";
import { colors } from "../theme/colors";
import type { RootStackParamList } from "./types";

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
          options={{ presentation: "fullScreenModal", headerShown: false }}
        />
        <Stack.Screen
          name="CourseSetup"
          component={CourseSetupScreen}
          options={{
            presentation: "transparentModal",
            animation: "fade",
            headerShown: false,
            contentStyle: { backgroundColor: "#0006" },
          }}
        />
        <Stack.Screen
          name="CourseSummary"
          component={CourseSummaryScreen}
          options={{
            presentation: "fullScreenModal",
            animation: "fade",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ItemDetail"
          component={ItemDetailModal}
          options={{
            title: "상세",
            presentation: "transparentModal",
            animation: "slide_from_bottom",
            headerShown: false,
            contentStyle: { backgroundColor: "#0006" },
          }}
        />
        <Stack.Screen
          name="BreakSheet"
          component={BreakSheet}
          options={{
            presentation: "fullScreenModal",
            animation: "fade",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="RewardModal"
          component={RewardModal}
          options={{
            presentation: "transparentModal",
            animation: "fade_from_bottom",
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
