export class Comment {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly createdAt: Date,
  ) {}
}
