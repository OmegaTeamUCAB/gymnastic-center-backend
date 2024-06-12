import { DomainException } from "@app/core";

export class InvalidBlogContentException extends DomainException {
    constructor() {
        super('Blog Content Too Short');
    }
}