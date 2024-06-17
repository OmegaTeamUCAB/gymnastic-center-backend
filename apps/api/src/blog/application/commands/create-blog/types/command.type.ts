export type CreateBlogCommand = {
  creationDate: Date;
  images: string[];
  tags: string[];
  title: string;
  category: string;
  content: string;
  instructor: string;
};
