import { AuthUser } from '../models/auth-user.model';

export interface IAuthRepository {
  findByEmail(email: string): Promise<AuthUser | null>;
  save(user: AuthUser): Promise<void>;
}
