import { BlogComment } from '../comment';

export class Blog {
  constructor(
    public id: string,
    public imageUrl: string,
    public title: string,
    public description: string,
    public content: string,
    public categoryId: string,
    public instructorId: string,
    public uploadDate: Date,
    public comments: BlogComment[],
    public tags: string[],
  ) {}
}
