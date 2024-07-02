export type WatchLessonCommand = {
  courseId: string;
  userId: string;
  lessonId: string;
  markAsCompleted: boolean;
  lastSecondWatched: number;
  totalSeconds: number;
};
