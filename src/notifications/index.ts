import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

let initialized = false;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function initNotifications() {
  if (initialized) return;

  const settings = await Notifications.getPermissionsAsync();
  if (!settings.granted) {
    await Notifications.requestPermissionsAsync();
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("focus", {
      name: "Focus",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 200, 150, 200],
      sound: undefined,
    });
  }

  initialized = true;
}

export async function notifyFocusSuccess(message: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title: "집중 완료", body: message },
    trigger: null,
  });
}
