import { ApplicationException } from "@app/core";

export class UsersListEmpty extends ApplicationException {
    constructor() {
        super('Users list is empty');
    }
}