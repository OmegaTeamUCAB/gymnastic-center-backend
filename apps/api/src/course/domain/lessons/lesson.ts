import { Comment } from '../comments/comment';

export class Lesson {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public comments: Comment[],
    public content?: string,
    public videoUrl?: string,
    public imageUrl?: string,
  ) {}
}
