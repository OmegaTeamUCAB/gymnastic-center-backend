export type UpdateBlogCommand = {
  id: string;
  date?: Date;
  images?: string[];
  tags?: string[];
  title?: string;
};
