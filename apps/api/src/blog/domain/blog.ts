export class Blog {
    constructor(
        public id: string,
        public imageUrl: string,
        public title: string,
        public description: string,
        public content: string,
        public uploadDate: Date,
    ) {}
}