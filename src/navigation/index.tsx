import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeIdleScreen from "../screens/HomeIdleScreen";
import CollectionScreen from "../screens/CollectionScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FocusSessionScreen from "../screens/FocusSessionScreen";
import CourseSetupScreen from "../screens/CourseSetupScreen";
import RewardModal from "../screens/RewardModal";
import CourseSummaryScreen from "../screens/CourseSummaryScreen";
import type { RootStackParamList, TabParamList } from "./types";
import BreakSheet from "@/screens/BreakSheet";

const Tab = createBottomTabNavigator<TabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeIdleScreen} />
      <Tab.Screen name="Collection" component={CollectionScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function NavigationRoot() {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Tabs" component={Tabs} />
        <RootStack.Screen
          name="FocusSession"
          component={FocusSessionScreen}
          options={{ presentation: "fullScreenModal" }}
        />
        <RootStack.Screen
          name="CourseSetup"
          component={CourseSetupScreen}
          options={{ presentation: "transparentModal" }}
        />
        <RootStack.Screen
          name="RewardModal"
          component={RewardModal}
          options={{ presentation: "transparentModal" }}
        />
        <RootStack.Screen
          name="CourseSummary"
          component={CourseSummaryScreen}
          options={{
            headerShown: false,
            presentation: "fullScreenModal",
            animation: "fade",
            animationTypeForReplace: "push",
            contentStyle: { backgroundColor: "#fff" },
          }}
        />
        <RootStack.Screen
          name="BreakSheet"
          component={BreakSheet}
          options={{ presentation: "transparentModal", headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
