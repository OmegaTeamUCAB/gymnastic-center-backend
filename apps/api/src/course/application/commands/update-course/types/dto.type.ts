export type UpdateCourseDto = {
  id: string
  title?: string;
  description?: string;
  level?: number;
  tags?: string[];
  weeks?: number;
  minutes?: number;
  imageUrl?: string;
  categoryId?: string;
};
