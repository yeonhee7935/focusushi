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
          borderTopColor: colors.stroke,
          height: 56 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(8, insets.bottom),
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtitle,
        tabBarLabel: ({ focused, color }) => (
          <Text style={{ color, fontSize: 11, fontWeight: focused ? "800" : "700" }}>
            {route.name === "Home" ? "홈" : route.name === "Collection" ? "컬렉션" : "설정"}
          </Text>
        ),
        tabBarIcon: ({ color, size }) => {
          const s = size ?? 22;
          if (route.name === "Home") return <Ionicons name="home" size={s} color={color} />;
          if (route.name === "Collection") return <Ionicons name="grid" size={s} color={color} />;
          return <Ionicons name="settings" size={s} color={color} />;
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
