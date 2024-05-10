import { ApplicationException } from "@app/core";

export class UserAlreadyExistsException extends ApplicationException{
    constructor(email: string){
        super(`User with email ${email} already exists`);
    }
}