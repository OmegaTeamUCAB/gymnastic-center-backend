import { DomainException } from "@app/core";

export class InvalidCommentException extends DomainException {
    constructor() {
        super('Invalid Comment.');
    }
}