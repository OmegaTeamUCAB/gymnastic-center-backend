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
  InstructorFollowed,
  InstructorUnfollowed,
} from './events';
import { InstructorCreated } from './events/instructor-created';
import { InstructorUserFollowUpdated } from './events/instructor-user-follow-updated';
import {
  AddressCity,
  AddressCoordinates,
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


  updateName(name: InstructorName): void {
    this.apply(InstructorNameUpdated.createEvent(this.id, name));
  }

  updateAddress(address: Address): void {
    this.apply(InstructorAddressUpdated.createEvent(this.id, address));
  }

  //TODO: Cambiar string por UserId para follow y unfollow
  follow(userFollowed: string){
    this.apply(InstructorFollowed.createEvent(this.id, userFollowed));
  }

  unfollow(userUnfollowed: string){
    this.apply(InstructorUnfollowed.createEvent(this.id, userUnfollowed));
  }


  static create(
    id: InstructorId,
    data: {
      name: InstructorName;
      country: AddressCountry;
      city: AddressCity;
      latitude: AddressCoordinates;
      longitude: AddressCoordinates;
      followers: InstructorFollowers;
    },
  ): Instructor {
    const instructor = new Instructor(id);
    console.log('SIII: ',id)
    instructor.apply(
      InstructorCreated.createEvent(
        id,
        data.name,
        data.country,
        data.city,
        data.latitude,
        data.longitude,
        data.followers,
      ),
    );
    console.log('SALIENDO INSTRUCTOR ', instructor)
    return instructor;
  }

  static loadFromHistory(id: InstructorId, events: DomainEvent[]): Instructor {
    const instructor = new Instructor(id);
    instructor.hydrate(events);
    return instructor;
  }

  [`on${InstructorCreated.name}`](context: InstructorCreated): void {
    this._name = new InstructorName(context.name);
    //TODO: POR ESTO NO SE CREA EL INSTRUCTOR -> DE DONDE SACO ESA INFO?
    this._address = new Address(
      this.address.id,
      this.address.country,
      this.address.city,
      this.address.coordinates,
    );
    this._followers = new InstructorFollowers(context.followers);
  }

  [`on${InstructorNameUpdated.name}`](context: InstructorNameUpdated): void {
    this._name = new InstructorName(context.name);
  }

  // TODO: Esta bien si aqui meto el ID??? *diria que si*
  // [`on${InstructorAddressUpdated.name}`](context: InstructorAddressUpdated): void {
  //   this._address = new Address(context.country, context.city, context.latitude, context.longitude);
  // }

  [`on${InstructorFollowed.name}`](): void {
    this._followers = new InstructorFollowers(this.followers.value + 1);
  }

  [`on${InstructorUnfollowed.name}`](): void {
    this._followers = new InstructorFollowers(this.followers.value - 1);
  }  
}
