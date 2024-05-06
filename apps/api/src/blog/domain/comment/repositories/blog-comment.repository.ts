import { BlogComment } from '../blog-comment';

export interface BlogCommentRepository {
    createCommentary(comment: BlogComment): Promise<void>;
}