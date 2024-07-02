import { ValueObject } from "@app/core";
import { InvalidUserPhoneException } from "../exceptions";

export class UserPhone implements ValueObject<UserPhone>{
    
    constructor(private readonly phone: string) {
        if (!UserPhone.isValid(phone)) throw new InvalidUserPhoneException(phone); 
    }

    get value(): string {
        return this.phone;
    }

    equals(other: UserPhone): boolean {
        return this.phone === other.phone;
    }

    private static isValid(value: string): boolean {
        return /^(\+?)([0-9]{1,3})(\s?)(\(?)([0-9]{1,3})(\)?)(\s?)([0-9]{3,4})(\s?)([0-9]{3,4})$/.test(value);
    }

}