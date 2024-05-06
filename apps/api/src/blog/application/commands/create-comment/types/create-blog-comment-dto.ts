export type CreateBlogCommentDto = {
    userId: string,
    blogId: string,
    content: string,
    postedAt: Date,
}