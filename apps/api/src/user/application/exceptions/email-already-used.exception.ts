import { ApplicationException } from "@app/core";

export class EmailAlreadyUsedException extends ApplicationException {
    constructor(email: string) {
        super(`User with email ${email} already exists`);
    }
}