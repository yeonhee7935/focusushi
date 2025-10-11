import { create } from "zustand";
import { STORAGE_KEYS, load, save } from "../store/storage";
import { AcquisitionLog, FoodItem } from "../data/types";

interface AcquisitionState {
  logs: AcquisitionLog[];
  loaded: boolean;
  loadLogs: () => Promise<void>;
  addLog: (item: FoodItem) => Promise<void>;
  clearLogs: () => Promise<void>;
}

export const useAcquisition = create<AcquisitionState>((set, get) => ({
  logs: [],
  loaded: false,

  loadLogs: async () => {
    const logs = await load<AcquisitionLog[]>(STORAGE_KEYS.FOOD_ACQUISITIONS, []);
    set({ logs, loaded: true });
  },

  addLog: async (item) => {
    const newLog: AcquisitionLog = { itemId: item.id, acquiredAt: Date.now() };
    const updated = [...get().logs, newLog];
    await save(STORAGE_KEYS.FOOD_ACQUISITIONS, updated);
    set({ logs: updated });
  },

  clearLogs: async () => {
    await save(STORAGE_KEYS.FOOD_ACQUISITIONS, []);
    set({ logs: [] });
  },
}));
