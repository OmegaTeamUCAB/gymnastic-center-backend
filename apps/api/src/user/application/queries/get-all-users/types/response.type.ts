import { Gender, Stat, User } from 'apps/api/src/user/domain/entities';

export type GetAllUsersResponse = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  gender: Gender;
  stats: Stat[];
}[];
