import { ValueObject } from "@app/core";
import { InvalidCountryException } from "../exceptions/invalid-country.exception";

export class AddressCountry implements ValueObject<AddressCountry> {
    constructor(private readonly _country: string) {
        if (_country.length < 3) throw new InvalidCountryException();
    }
    
    get value(): string {
        return this._country;
    }
    
    public equals(other: AddressCountry): boolean {
        return this._country === other.value;
    }
}