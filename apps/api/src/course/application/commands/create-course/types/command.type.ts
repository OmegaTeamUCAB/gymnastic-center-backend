export type CreateCourseCommand = {
  name: string;
  description: string;
  level: number;
  tags: string[];
  weeks: number;
  minutes: number;
  image: string;
  categoryId: string;
  instructorId: string;
  // lessons: CreateLessonsDto;
};

// export type CreateLessonsDto = {
//   title: string;
//   content?: string;
//   videoUrl?: string;
//   imageUrl?: string;
// }[];
