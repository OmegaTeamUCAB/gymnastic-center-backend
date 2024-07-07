import { Optional } from '@app/core';
import { User } from '../models/user.model';

export interface UserRepository {
  findUserById(userId: string): Promise<Optional<User>>;
}
