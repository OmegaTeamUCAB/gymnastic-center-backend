export type CreateBlogDto = {
    imageUrl: string,
    title: string,
    description: string,
    content: string,
    categoryId: string,
    instructorId: string,
    tags: string[],
}