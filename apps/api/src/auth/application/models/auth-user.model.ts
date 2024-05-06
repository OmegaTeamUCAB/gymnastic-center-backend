export class AuthUser {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public verificationCode?: string,
    public codeExpirationDate?: Date,
  ) {}
}
