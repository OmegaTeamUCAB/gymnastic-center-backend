import { DomainException } from "@app/core";

export class InvalidAnswerIdException extends DomainException {
    constructor() {
        super(`The instructor answer id is invalid.`);
    }
}