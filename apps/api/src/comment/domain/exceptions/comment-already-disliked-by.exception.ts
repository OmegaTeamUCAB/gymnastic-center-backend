import { DomainException } from "@app/core";

export class CommentAlreadyDislikedByException extends DomainException {
    constructor() {
        super('Comment already liked by user.');
    }
}