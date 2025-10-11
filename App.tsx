import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import NavigationRoot from "./src/navigation";
import { useEffect } from "react";
import { useSettingsInit } from "./src/hooks/useSettings";
import { useCourse } from "./src/hooks/useCourse";
import { useAcquisition } from "./src/hooks/useAcquisition";

export default function App() {
  useSettingsInit();
  const loadCourses = useCourse((s) => s.loadCourses);
  const loadLogs = useAcquisition((s) => s.loadLogs);

  useEffect(() => {
    loadCourses();
    loadLogs();
  }, [loadCourses, loadLogs]);

  return (
    <>
      <NavigationRoot />
      <StatusBar style="auto" />
    </>
  );
}
