import { DomainException } from "@app/core";

export class InvalidUserPhoneException extends DomainException {
    constructor(phone: string) {
        super(`Invalid phone number: ${phone}`);
    }
}