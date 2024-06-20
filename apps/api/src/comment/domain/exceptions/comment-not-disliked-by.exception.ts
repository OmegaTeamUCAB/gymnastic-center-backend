import { DomainException } from "@app/core";

export class CommentDoesntLikedByException extends DomainException {
    constructor() {
        super('Comment is not liked by this user');
    }
}