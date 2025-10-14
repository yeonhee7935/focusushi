import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { useSettings } from "../hooks/useSettings";
import { playSfx } from "../lib/feedback";

type HapticKind = "light" | "success" | "warning";
type SfxKey = "reward" | "start" | "breakStart" | "breakEnd";

export function useFeedback() {
  const { settings } = useSettings();
  const haptic = useCallback(
    async (kind: HapticKind) => {
      if (!settings.vibration) return;
      try {
        if (kind === "success")
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        else if (kind === "warning")
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        else await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    },
    [settings.vibration],
  );

  const sfx = useCallback(
    async (key: SfxKey) => {
      if (!settings.sound) return;
      await playSfx(key);
    },
    [settings.sound],
  );

  return { haptic, sfx };
}
