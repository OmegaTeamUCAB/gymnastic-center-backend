import { ApplicationException } from "@app/core";

export class UserNotFoundException extends ApplicationException {
    constructor() {
        super('User not found');
    }
}