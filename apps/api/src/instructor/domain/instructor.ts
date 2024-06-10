import { AggregateRoot } from '@app/core';
import { InstructorFollowers, InstructorId, InstructorName } from './value-objects';
import { InvalidInstructorException } from './exceptions/invalid-instructor.exception';
import { Address } from './entities/address-entity/address';
import { InstructorNameUpdated, InstructorAddressUpdated, InstructorFollowersUpdated} from './events';
import { InstructorCreated } from './events/instructor-created';


export class Instructor extends AggregateRoot<InstructorId>{
  constructor(id: InstructorId) {
    super(id);
  }

  private _name: InstructorName;
  private _address: Address;
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

  updateFollowers(followers: InstructorFollowers): void {
    this.apply(InstructorFollowersUpdated.createEvent(this.id, followers));
  }  
  
  [`on${InstructorCreated.name}`](context: InstructorCreated): void {
    this._name = new InstructorName(context.name);
    this._address = new Address(this.address.id, this.address.country, this.address.city);
    this._followers = new InstructorFollowers(context.followers);
  }

  [`on${InstructorNameUpdated.name}`](context: InstructorNameUpdated): void {
    this._name = new InstructorName(context.name);
  }

  // [`on${InstructorAddressUpdated.name}`](context: InstructorAddressUpdated): void {
  //   this._address = new Address(context.country, context.city, context.direction);
  // }

  [`on${InstructorFollowersUpdated.name}`](context: InstructorFollowersUpdated): void {
    this._followers = new InstructorFollowers(this.followers.value);
  }

}
