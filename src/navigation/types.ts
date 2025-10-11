export type TabParamList = {
  Home: undefined;
  Collection: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  FocusSession: undefined;
  CourseSetup: undefined;
  RewardModal: { itemId?: string } | undefined;
  CourseSummary: { courseId?: string } | undefined;
  BreakSheet: undefined;
};
