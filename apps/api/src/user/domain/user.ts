import { AggregateRoot, DomainEvent } from "@app/core";
import { InvalidUserException } from "./exceptions";
import { UserEmail, UserId, UserImage, UserName, UserPhone } from "./value-objects";
import { UserCreated, UserImageUpdated, UserNameUpdated, UserPhoneUpdated } from "./events";

export class User extends AggregateRoot<UserId> {
  
  private constructor(id: UserId) {
    super(id);
  }
  
  protected validateState(): void {
    if (!this.id || !this._email || !this._name || !this._phone ) {
    throw new InvalidUserException();
    }
  }

  private _name: UserName;
  private _email: UserEmail;
  private _phone: UserPhone;
  private _image?: UserImage;


  get name(): UserName {
    return this._name;
  }

  get email(): UserEmail {
    return this._email;
  }

  get phone(): UserPhone {
    return this._phone;
  }

  get image(): UserImage {
    return this._image;
  }

  updateName(name: UserName): void {
    this.apply(UserNameUpdated.createEvent(this.id, name));
  }

  updatePhone(phone: UserPhone): void {
    this.apply(UserPhoneUpdated.createEvent(this.id, phone));
  }

  updateImage(image: UserImage): void {
    this.apply(UserImageUpdated.createEvent(this.id, image));
  }

  static create(
    id: UserId,
    data: {    
      name: UserName,
      email: UserEmail,
      phone: UserPhone,
      image?: UserImage
    }
  ): User {
    const user = new User(id);
    user.apply(UserCreated.createEvent(id, data.name, data.email, data.phone, data.image));
    return user;
  }

  static loadFromHistroy(id: UserId, events: DomainEvent[]): User {
    const user = new User(id);
    user.hydrate(events);
    return user;
  }

  [`on${UserCreated.name}`](context: UserCreated): void {
    this._name = new UserName(context.name);
    this._email = new UserEmail(context.email);
    this._phone = new UserPhone(context.phone);
    this._image = new UserImage(context.image);
  }

  [`on${UserNameUpdated.name}`](context: UserNameUpdated): void {
    this._name = new UserName(context.name);
  }

  [`on${UserPhoneUpdated.name}`](context: UserPhoneUpdated): void {
    this._phone = new UserPhone(context.phone);
  }

  [`on${UserImageUpdated.name}`](context: UserImageUpdated): void {
    this._image = new UserImage(context.image);
  }

}