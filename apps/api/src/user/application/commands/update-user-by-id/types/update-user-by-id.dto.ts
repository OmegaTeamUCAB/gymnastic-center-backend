import { Gender, Stat } from 'apps/api/src/user/domain/entities';

export type UpdateUserDto = {
  id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: Date;
  gender?: Gender;
  stats?: Stat[];
};
