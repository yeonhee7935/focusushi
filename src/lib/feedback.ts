import { Audio, AVPlaybackStatusSuccess } from "expo-av";

type SfxKey = "reward" | "start" | "breakStart" | "breakEnd";

let audioModeSet = false;

const sources: Record<SfxKey, number> = {
  reward: require("../../assets/sfx/reward.mp3"),
  start: require("../../assets/sfx/start.mp3"),
  breakStart: require("../../assets/sfx/break-start.mp3"),
  breakEnd: require("../../assets/sfx/break-end.mp3"),
};

export async function playSfx(key: SfxKey) {
  try {
    if (!audioModeSet) {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
      });
      audioModeSet = true;
    }
    const { sound } = await Audio.Sound.createAsync(sources[key], { shouldPlay: true });
    const status = (await sound.getStatusAsync()) as AVPlaybackStatusSuccess;
    if (status.isLoaded) {
      // 자동 언로드: 길이만큼 기다렸다가 해제
      sound.setOnPlaybackStatusUpdate(async (st) => {
        if (st.isLoaded && st.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } else {
      await sound.unloadAsync();
    }
  } catch {
    // 무시
  }
}
