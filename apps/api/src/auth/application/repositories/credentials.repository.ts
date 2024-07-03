import { Optional } from '@app/core';
import { Credentials } from '../models/credentials.model';

export interface CredentialsRepository {
  findCredentialsByUserId(userId: string): Promise<Optional<Credentials>>;
  findCredentialsByEmail(email: string): Promise<Optional<Credentials>>;
  saveCredentials(credentials: Credentials): Promise<void>;
  hasDevice({
    userId,
    deviceId,
  }: {
    userId: string;
    deviceId: string;
  }): Promise<boolean>;
  addDevice({
    userId,
    deviceId,
  }: {
    userId: string;
    deviceId: string;
  }): Promise<void>;
}
