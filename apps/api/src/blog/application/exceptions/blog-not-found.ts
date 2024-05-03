import { ApplicationException } from "@app/core";

export class BlogNotFound extends ApplicationException {
    constructor() {
        super(`Blog not found`);
    }
}