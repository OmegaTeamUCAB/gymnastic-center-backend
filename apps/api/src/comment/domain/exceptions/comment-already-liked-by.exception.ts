import { DomainException } from "@app/core";

export class CommentAlreadyLikedByException extends DomainException {
    constructor() {
        super('Comment already liked by user.');
    }
}