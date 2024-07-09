export type Course = {
  id: string;
  title: string;
  description: string;
  level: number;
  tags: string[];
  weeks: number;
  minutes: number;
  image: string;
  publishDate: Date;
  views: number;
  trainer: { id: string; name: string; image: string };
  category: { id: string; name: string };
  lessons: { id: string; title: string; description: string; video: string }[];
};
