export class BlogComment{
    constructor(
        public id: string,
        public userId: string,
        public blogId: string,
        public content: string,
        public postedAt: Date,
    ) {}
}