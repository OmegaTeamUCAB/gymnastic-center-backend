export class User {
  constructor(
    public id: string,
    public fullName: string,
    public email: string,
    public phoneNumber: string,
    public image: string,
  ) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.fullName;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPhoneNumber(): string {
    return this.phoneNumber;
  }

  public getImage(): string {
    return this.image;
  }

  public setName(name: string): void {
    this.fullName = name;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
  }

  public setImage(image: string): void {
    this.image = image;
  }
}
