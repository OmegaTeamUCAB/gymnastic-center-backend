import { DomainException } from "@app/core";

export class CommentIsntPublishedByException extends DomainException {
    constructor() {
        super('Comment is not published by this user');
    }
}