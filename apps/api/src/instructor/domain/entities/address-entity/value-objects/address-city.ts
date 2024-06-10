import { ValueObject } from "@app/core";
import { InvalidCityException } from "../exceptions/invalid-city.exception";

export class AddressCity implements ValueObject<AddressCity> {
    constructor(private readonly _city: string) {
        if (_city.length < 3) throw new InvalidCityException();
    }
    
    get value(): string {
        return this._city;
    }
    
    public equals(other: AddressCity): boolean {
        return this._city === other.value;
    }
}