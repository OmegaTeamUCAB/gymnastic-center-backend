export type GetCoursesResponse = {
  id: string;
  name: string;
  description: string;
  level: number;
  tags: string[];
  weeks: number;
  minutes: number;
  imageUrl: string;
  categoryId: string;
  instructorId: string;
  lessons: GetLessonsResponse;
}[];

export type GetLessonsResponse = {
  id: string;
  title: string;
  comments: GetCommentsResponse;
  content?: string;
  videoUrl?: string;
  imageUrl?: string;
}[];

export type GetCommentsResponse = {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
}[];
