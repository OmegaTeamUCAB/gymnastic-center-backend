export type CreateBlogDto = {
    imageUrl: string,
    title: string,
    description: string,
    content: string,
    uploadDate: Date,
    tags: string[],
}