export type Comment = {
  id: string;
  content: string;
  blog: string;
  publisher: {
    id: string;
    name: string;
    image?: string;
  };
  publishDate: Date;
  likes: string[];
  dislikes: string[];
  numberOfLikes: number;
  numberOfDislikes: number;
};
