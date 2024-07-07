import { Optional } from "@app/core";
import { Comment } from "../models/comment.model";

export interface CommentRepository {
    findCommentById(commentId: string): Promise<Optional<Comment>>;
}