export type Gender = {
    male: 'Male',
    female: 'Female'
}

export class Instructor {
    public name: string;
    public lastName: string;
    public birthDate: Date;
    public email: string;
    public gender: Gender;
}