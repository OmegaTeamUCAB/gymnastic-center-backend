import { User } from '../entities';

export interface UserRepository {
  findAllUsers(): Promise<User[]>;
  findUserById(id: string): Promise<User>;
  saveUser(user: User): Promise<void>;
  deleteUserById(id: string): Promise<void>;
}
