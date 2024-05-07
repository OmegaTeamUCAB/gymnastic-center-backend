import { BlogComment } from '../../comment/blog-comment';
import { Blog } from '../blog';

export interface BlogRepository {
    saveBlog(data: Blog): Promise<void>;
    findAllBlogs(): Promise<Blog[]>;
    getBlogById(id: string): Promise<Blog>;
    createComment(data: BlogComment): Promise<void>;
}