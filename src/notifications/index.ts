// notifications/index.ts
import { Platform, AppState, AppStateStatus } from "react-native";
import * as Notifications from "expo-notifications";

let initialized = false;

/** 현재 앱이 포그라운드인지 추적 */
let isForeground = true;
let appStateSub: { remove: () => void } | null = null;

/**
 * 포그라운드에서는 배너/리스트를 표시하지 않음
 * (Expo SDK 51+ 기준: shouldShowAlert는 deprecated)
 */
Notifications.setNotificationHandler({
  handleNotification: async () => {
    const show = !isForeground;
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: show,
      shouldShowList: show,
    };
  },
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

  // AppState 구독 (포그라운드/백그라운드 감지)
  if (!appStateSub) {
    isForeground = AppState.currentState === "active";
    appStateSub = AppState.addEventListener("change", (s: AppStateStatus) => {
      isForeground = s === "active";
      // console.log(`[notif] AppState=${s} → isForeground=${isForeground}`);
    });
  }

  initialized = true;
}

/**
 * 포커스 성공 시 알림 발송
 * - 포그라운드에서는 handler에서 숨김
 * - 백그라운드/종료 상태일 때만 실제 표시
 */
export async function notifyFocusSuccess(message: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "집중 완료",
      body: message,
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: null, // 즉시 발송
  });
}
