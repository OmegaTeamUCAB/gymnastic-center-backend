import { DomainException } from "@app/core";

export class InvalidAnswerDateException extends DomainException {
    constructor() {
        super('Invalid answer date');
    }
}