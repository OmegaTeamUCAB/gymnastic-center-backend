import { Gender, Stat, User } from 'apps/api/src/user/domain/entities';

export type GetAllUsersResponse = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  birthDate: Date;
  gender: Gender;
  stats: Stat[];
}[];
