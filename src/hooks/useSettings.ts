import { useEffect } from "react";
import { create } from "zustand";
import { load, save, STORAGE_KEYS } from "../store/storage";
import { AppSettings } from "../data/types";
import { DEFAULT_SETTINGS } from "../data/constants";

interface SettingsState {
  settings: AppSettings;
  setSettings: (s: Partial<AppSettings>) => void;
  resetSettings: () => void;
  loaded: boolean;
}

export const useSettings = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loaded: false,
  setSettings: (partial) => {
    const next = { ...get().settings, ...partial };
    set({ settings: next });
    save(STORAGE_KEYS.APP_SETTINGS, next);
  },
  resetSettings: () => {
    set({ settings: DEFAULT_SETTINGS });
    save(STORAGE_KEYS.APP_SETTINGS, DEFAULT_SETTINGS);
  },
}));

export function useSettingsInit() {
  const set = useSettings((s) => s.setSettings);
  useEffect(() => {
    load<AppSettings>(STORAGE_KEYS.APP_SETTINGS, DEFAULT_SETTINGS).then((s) => {
      set(s);
      useSettings.setState({ loaded: true });
    });
  }, [set]);
}
