export type UpdateBlogCommand = {
  id: string;
  images?: string[];
  tags?: string[];
  title?: string;
  category?: string;
  content?: string;
};
