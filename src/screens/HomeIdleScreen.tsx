import { useCallback, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions, AppState, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { useRootNav } from "@/navigation/hooks";
import { useVideoPlayer, VideoView } from "expo-video";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeIdleScreen() {
  const nav = useRootNav();
  const player = useVideoPlayer(require("../../assets/videos/idle.mp4"), (p) => {
    p.loop = true;
    p.muted = true;
    p.play(); // 초기 재생
  });

  // 화면 포커스시 재생
  useFocusEffect(
    useCallback(() => {
      player.play();

      return () => {
        player.pause();
      };
    }, [player]),
  );

  // 앱 백그라운드/포그라운드 처리
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        player.play();
      } else {
        player.pause();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  const onStart = useCallback(() => {
    nav.navigate("CourseSetup");
  }, [nav]);

  return (
    <SafeAreaView style={s.wrap}>
      <View style={s.center}>
        <Image source={require("assets/videos/chef.png")} style={s.bgVideo} />
        {/* <VideoView
          style={s.bgVideo}
          player={player}
          contentFit="cover"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        /> */}
        <Pressable style={s.cta} onPress={onStart} accessibilityRole="button">
          <Text style={s.ctaText}>주문하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const maxSize = Math.min(screenWidth, screenHeight) * 0.9;

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  subtitle: { fontSize: 16, color: colors.subtitle, textAlign: "center" },
  cta: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: colors.primary,
    minWidth: 220,
    alignItems: "center",
    marginTop: 16,
  },
  ctaText: { color: colors.primaryTextOn, fontSize: 18, fontWeight: "800" },
  bgVideo: { width: maxSize, height: maxSize, marginBottom: 22 },
});
