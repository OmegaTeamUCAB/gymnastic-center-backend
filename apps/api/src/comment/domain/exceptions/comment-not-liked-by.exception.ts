import { DomainException } from "@app/core";

export class CommentDoesntDislikedByException extends DomainException {
    constructor() {
        super('Comment is not disliked by this user');
    }
}