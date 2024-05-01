export type Gender = {
    male: 'Male',
    female: 'Female'
}

export class Instructor {
    name: string;
    lastName: string;
    birthDate: Date;
    email: string;
    gender: Gender;
}