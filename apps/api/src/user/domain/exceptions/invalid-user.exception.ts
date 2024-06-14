import { DomainException } from "@app/core";

export class InvalidUserException extends DomainException {
    constructor() {
        super('Invalid User');
    }
}