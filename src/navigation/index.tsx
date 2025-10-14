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
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen
          name="FocusSession"
          component={FocusSessionScreen}
          options={{ presentation: "fullScreenModal" }}
        />
        <Stack.Screen
          name="CourseSetup"
          component={CourseSetupScreen}
          options={{ presentation: "transparentModal" }}
        />
        <Stack.Screen
          name="CourseSummary"
          component={CourseSummaryScreen}
          options={{ presentation: "fullScreenModal", animation: "fade" }}
        />
        <Stack.Screen
          name="ItemDetail"
          component={ItemDetailModal}
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="BreakSheet"
          component={BreakSheet}
          options={{ presentation: "fullScreenModal", animation: "fade" }}
        />
        <Stack.Screen
          name="RewardModal"
          component={RewardModal}
          options={{ presentation: "transparentModal", animation: "fade_from_bottom" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
