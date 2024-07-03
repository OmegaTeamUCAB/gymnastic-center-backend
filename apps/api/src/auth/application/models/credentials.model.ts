export class Credentials {
  constructor(
    public userId: string,
    public email: string,
    public password: string,
    public devices: string[] = [],
    public verificationCode?: string,
    public codeExpirationDate?: Date,
  ) {}
}
