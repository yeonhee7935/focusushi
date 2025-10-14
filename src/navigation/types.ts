export type CourseSummarySnapshot = {
  completedSessions: number;
  plannedSessions: number;
  items: { itemId: string; acquiredAt: number }[];
  focusMs: number;
  breakMs: number;
};

export type RootStackParamList = {
  Tabs: undefined;
  FocusSession: undefined;
  CourseSetup: undefined;
  RewardModal: undefined;
  BreakSheet: undefined;
  ItemDetail: { itemId: string };
  CourseSummary: { snapshot?: CourseSummarySnapshot } | undefined;
};

export type TabParamList = {
  Home: undefined;
  Collection: undefined;
  Settings: undefined;
};
