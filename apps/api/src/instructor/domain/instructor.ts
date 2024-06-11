import { AggregateRoot, DomainEvent } from '@app/core';
import {
  InstructorFollowers,
  InstructorId,
  InstructorName,
  InstructorUserFollow,
} from './value-objects';
import { InvalidInstructorException } from './exceptions/invalid-instructor.exception';
import { Address } from './entities/address-entity/address';
import {
  InstructorNameUpdated,
  InstructorAddressUpdated,
  InstructorFollowersUpdated,
} from './events';
import { InstructorCreated } from './events/instructor-created';
import { InstructorUserFollowUpdated } from './events/instructor-user-follow-updated';
import {
  AddressCity,
  AddressCountry,
} from './entities/address-entity/value-objects';

export class Instructor extends AggregateRoot<InstructorId> {
  private constructor(id: InstructorId) {
    super(id);
  }
  private _name: InstructorName;
  private _address: Address;
  //UserId[] -> para el tipo de dato de _followers
  private _followers: InstructorFollowers;
  private _userFollow: InstructorUserFollow;

  protected validateState(): void {
    if (!this.id || this._name || this._address || this._followers) {
      throw new InvalidInstructorException();
    }
  }

  get name(): InstructorName {
    return this._name;
  }

  get address(): Address {
    return this._address;
  }

  get followers(): InstructorFollowers {
    return this._followers;
  }

  get userFollow(): InstructorUserFollow {
    return this._userFollow;
  }

  updateName(name: InstructorName): void {
    this.apply(InstructorNameUpdated.createEvent(this.id, name));
  }

  updateAddress(address: Address): void {
    this.apply(InstructorAddressUpdated.createEvent(this.id, address));
  }

  updateFollowers(followers: InstructorFollowers): void {
    this.apply(InstructorFollowersUpdated.createEvent(this.id, followers));
  }

  updateUserFollow(userFollow: InstructorUserFollow): void {
    this.apply(InstructorUserFollowUpdated.createEvent(this.id, userFollow));
  }

  static create(
    id: InstructorId,
    data: {
      name: InstructorName;
      city: AddressCity;
      country: AddressCountry;
      followers: InstructorFollowers;
      userFollow: InstructorUserFollow;
    },
  ): Instructor {
    const instructor = new Instructor(id);
    instructor.apply(
      InstructorCreated.createEvent(
        id,
        data.name,
        data.city,
        data.country,
        data.followers,
        data.userFollow,
      ),
    );
    return instructor;
  }

  static loadFromHistory(id: InstructorId, events: DomainEvent[]): Instructor {
    const instructor = new Instructor(id);
    instructor.hydrate(events);
    return instructor;
  }

  [`on${InstructorCreated.name}`](context: InstructorCreated): void {
    this._name = new InstructorName(context.name);
    this._address = new Address(
      this.address.id,
      this.address.country,
      this.address.city,
    );
    this._followers = new InstructorFollowers(context.followers);
    this._userFollow = new InstructorUserFollow(context.userFollow);
  }

  [`on${InstructorNameUpdated.name}`](context: InstructorNameUpdated): void {
    this._name = new InstructorName(context.name);
  }

  // [`on${InstructorAddressUpdated.name}`](context: InstructorAddressUpdated): void {
  //   this._address = new Address(context.country, context.city, context.direction);
  // }

  [`on${InstructorFollowersUpdated.name}`](
    context: InstructorFollowersUpdated,
  ): void {
    //TODO: Cambiar el tipo de followers con lo de luis elian
    this._followers = new InstructorFollowers(context.followers.value);
  }

  [`on${InstructorUserFollowUpdated.name}`](
    context: InstructorUserFollowUpdated,
  ): void {
    this._userFollow = new InstructorUserFollow(context.userFollow);
  }
}
