export type UpdateCourseCommand = {
  id: string;
  name?: string;
  description?: string;
  level?: number;
  tags?: string[];
  duration?: {
    weeks?: number;
    minutes?: number;
  }
  image?: string;
  categoryId?: string;
};
