import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    // iOS 최신 타입에 맞춰 추가
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function initNotifications() {
  const settings = await Notifications.getPermissionsAsync();
  if (!settings.granted) {
    await Notifications.requestPermissionsAsync();
  }
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
}

export async function scheduleLocal(msFromNow: number, title: string, body?: string) {
  const seconds = Math.max(1, Math.round(msFromNow / 1000));

  // 최신 타입: TimeInterval 트리거는 type 필드가 필요
  const trigger: Notifications.TimeIntervalTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds,
    repeats: false,
  };

  return Notifications.scheduleNotificationAsync({
    content: { title, body, sound: "default" },
    trigger,
  });
}

export async function cancelNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}

export async function cancelAll() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
