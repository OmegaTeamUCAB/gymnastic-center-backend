export type UpdateCourseDto = {
  id: string
  name?: string;
  description?: string;
  level?: number;
  tags?: string[];
  weeks?: number;
  minutes?: number;
  imageUrl?: string;
  categoryId?: string;
};
