export class Comment {
  constructor(
    public id: string,
    public content: string,
    public blog: string,
    public publisher : {
        id: string,
        name: string,
        image?: string,
    },
    public publishDate: Date,
    public likes: string[],
    public dislikes: string[],
    public numberOfLikes: number,
    public numberOfDislikes: number,
  ) {}
}