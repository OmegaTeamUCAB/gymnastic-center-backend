import { Credentials } from '../models/credentials.model';

export interface CredentialsRepository {
  findCredentialsByEmail(email: string): Promise<Credentials | null>;
  saveCredentials(credentials: Credentials): Promise<void>;
}
