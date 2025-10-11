import { create } from "zustand";
import { STORAGE_KEYS, load, save } from "../store/storage";
import { Course, CourseItem } from "../data/types";

interface CourseState {
  current?: Course;
  history: Course[];
  loaded: boolean;
  createCourse: (params: {
    plannedSessions: number;
    focusMs: number;
    breakMs: number;
  }) => Promise<void>;
  completeSession: (item?: CourseItem) => Promise<void>;
  endCourse: () => Promise<void>;
  loadCourses: () => Promise<void>;
}

export const useCourse = create<CourseState>((set, get) => ({
  current: undefined,
  history: [],
  loaded: false,

  loadCourses: async () => {
    const current = await load<Course | undefined>(STORAGE_KEYS.CURRENT_COURSE, undefined);
    const history = await load<Course[]>(STORAGE_KEYS.COURSE_HISTORY, []);
    set({ current, history, loaded: true });
  },

  createCourse: async ({ plannedSessions, focusMs, breakMs }) => {
    const newCourse: Course = {
      id: String(Date.now()),
      startedAt: Date.now(),
      plannedSessions,
      completedSessions: 0,
      focusMs,
      breakMs,
      items: [],
    };
    await save(STORAGE_KEYS.CURRENT_COURSE, newCourse);
    set({ current: newCourse });
  },

  completeSession: async (item) => {
    const current = get().current;
    if (!current) return;
    const updated: Course = {
      ...current,
      completedSessions: current.completedSessions + 1,
      items: item ? [...current.items, item] : current.items,
    };
    await save(STORAGE_KEYS.CURRENT_COURSE, updated);
    set({ current: updated });
  },

  endCourse: async () => {
    const current = get().current;
    if (!current) return;
    const history = [...get().history, current];
    await save(STORAGE_KEYS.COURSE_HISTORY, history);
    await save(STORAGE_KEYS.CURRENT_COURSE, undefined);
    set({ current: undefined, history });
  },
}));
