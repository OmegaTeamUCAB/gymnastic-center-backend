import { Blog } from "../blog";

export interface BlogRepository {
    createBlog(data: Blog): Promise<void>;
    findAllBlogs(): Promise<Blog[]>;
    getBlogById(id: string): Promise<Blog>; 
    // updateBlogById( id: string, data: any): Promise<Blog>;
    // deleteBlogById(id: string): Promise<void>;
}