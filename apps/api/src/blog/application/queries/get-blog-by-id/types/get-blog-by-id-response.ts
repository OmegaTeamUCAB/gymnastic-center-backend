export type GetBlogByIdResponse = {
  id: string;
  imageUrl: string;
  comments: {
    id: string;
    userId: string;
    blogId: string;
    content: string;
    postedAt: Date;
  }[];
  title: string;
  description: string;
  content: string;
  uploadDate: Date;
  tags: string[];
  categoryId: string;
  instructorId: string;
};
