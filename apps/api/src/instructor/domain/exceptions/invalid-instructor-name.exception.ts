import { DomainException } from "@app/core";

export class InvalidInstructorNameException extends DomainException {
    constructor() {
        super('Invalid Instructor Name');
    }
}