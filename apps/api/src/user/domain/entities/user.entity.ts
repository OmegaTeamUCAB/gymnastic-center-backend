import { Stat } from "./stat.entity";

export type Gender = 'Male'|'Female'

export class User {

    constructor(
        public id: string,
        public fullName: string,
        public email: string,
        public phoneNumber: string,
        public birthDate?: Date,
        public gender?: Gender,
        public stats?: Stat[]
    ) { }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.fullName;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPhoneNumber(): string {
        return this.phoneNumber;
    }


    public getBirthDate(): Date {
        return this.birthDate;
    }

    public getGender(): Gender {
        return this.gender;
    }

    public getStats(): Stat[] {
        return this.stats;
    }

    public setName(name: string): void {
        this.fullName = name;
    }
    
    public setEmail(email: string): void {
        this.email = email;
    }

    public setPhoneNumber(phoneNumber: string): void {
        this.phoneNumber = phoneNumber;
    }

    public setBirthDate(birthDate: Date): void {
        this.birthDate = birthDate;
    }

    public setGender(gender: Gender): void {
        this.gender = gender;
    }

    public setStats(stats: Stat[]): void {
        this.stats = stats;
    }

}
