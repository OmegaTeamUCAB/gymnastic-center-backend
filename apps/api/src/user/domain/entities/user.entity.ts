import { Stat } from "./stat.entity";

export type Gender = 'Male'|'Female'

export class User {

    constructor(
        private id: string,
        private name: string,
        private lastName: string,
        private email: string,
        private password: string,
        private birthDate: Date,
        private gender: Gender,
        private stats: Stat[]
    ) {

    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
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
        this.name = name;
    }

    public setLastName(lastName: string): void {
        this.lastName = lastName;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setPassword(password: string): void {
        this.password = password;
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
