import { ApplicationException } from "@app/core";

export class CommentNotFoundException extends ApplicationException {
    constructor() {
        super(`Command not found`);
    }
}