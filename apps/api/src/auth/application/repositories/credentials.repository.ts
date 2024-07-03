import { Credentials } from '../models/credentials.model';

export interface CredentialsRepository {
  findCredentialsByEmail(email: string): Promise<Credentials | null>;
  saveCredentials(credentials: Credentials): Promise<void>;
  hasDevice(userId: string, deviceId: string): Promise<boolean>;
  addDevice(userId: string, deviceId: string): Promise<void>;
}
