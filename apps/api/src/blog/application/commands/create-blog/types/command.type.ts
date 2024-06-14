export type CreateBlogCommand = {
  date: Date;
  images: string[];
  tags: string[];
  title: string;
  category: string,
  content: string;
};
