import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeIdleScreen from "../screens/HomeIdleScreen";
import CollectionScreen from "../screens/CollectionScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { colors } from "../theme/colors";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabParamList = {
  Home: undefined;
  Collection: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function Tabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneContainerStyle: { backgroundColor: colors.surface },
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 56 + insets.bottom,
          paddingTop: 10,
          paddingBottom: Math.max(10, insets.bottom),
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtitle,
        tabBarLabel: ({ focused, color }) => (
          <Text
            style={{
              color,
              fontSize: 14,
              marginTop: 4,
              fontWeight: focused ? "800" : "700",
            }}
          >
            {route.name === "Home" ? "홈" : route.name === "Collection" ? "컬렉션" : "설정"}
          </Text>
        ),
        tabBarIcon: ({ color, size, focused }) => {
          const s = size ?? 22;
          if (route.name === "Home") {
            return <Ionicons name={focused ? "home" : "home-outline"} size={s} color={color} />;
          }
          if (route.name === "Collection") {
            return <Ionicons name={focused ? "grid" : "grid-outline"} size={s} color={color} />;
          }
          return (
            <Ionicons name={focused ? "settings" : "settings-outline"} size={s} color={color} />
          );
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeIdleScreen} />
      <Tab.Screen name="Collection" component={CollectionScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
