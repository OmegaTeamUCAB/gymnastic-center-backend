import { AggregateRoot, DomainEvent } from '@app/core';
import { InvalidInstructorException } from './exceptions/invalid-instructor.exception';
import { InstructorCreated } from './events/instructor-created';
import { UserId } from '../../user/domain/value-objects';
import { InstructorAlreadyFollowedException } from './exceptions/instructor-already-followed.exception';
import { InstructorNotFollowedException } from './exceptions/instructor-not-followed.exception';
import { InstructorNameUpdated } from './events/instructor-name-updated';
import { InstructorFollowed } from './events/instructor-followed';
import { InstructorUnfollowed } from './events/instructor-unfollowed';
import { InstructorId } from './value-objects/instructor-id';
import { InstructorName } from './value-objects/instructor-name';

export class Instructor extends AggregateRoot<InstructorId> {
  private constructor(id: InstructorId) {
    super(id);
  }
  private _name: InstructorName;
  private _followers: UserId[];

  protected validateState(): void {
    if (!this.id || !this._name || !this._followers) {
      throw new InvalidInstructorException();
    }
  }

  get name(): InstructorName {
    return this._name;
  }

  get followers(): UserId[] {
    return this._followers;
  }

  updateName(name: InstructorName): void {
    this.apply(InstructorNameUpdated.createEvent(this.id, name));
  }

  addFollower(user: UserId) {
    if (this.isFollowedBy(user)) throw new InstructorAlreadyFollowedException();
    this.apply(InstructorFollowed.createEvent(this.id, user));
  }

  removeFollower(user: UserId) {
    if (!this.isFollowedBy(user)) throw new InstructorNotFollowedException();
    this.apply(InstructorUnfollowed.createEvent(this.id, user));
  }

  isFollowedBy(user: UserId): boolean {
    return this._followers.some((follower) => follower.equals(user));
  }

  static create(
    id: InstructorId,
    data: {
      name: InstructorName;
    },
  ): Instructor {
    const instructor = new Instructor(id);
    instructor.apply(InstructorCreated.createEvent(id, data.name));
    return instructor;
  }

  static loadFromHistory(id: InstructorId, events: DomainEvent[]): Instructor {
    const instructor = new Instructor(id);
    instructor.hydrate(events);
    return instructor;
  }

  [`on${InstructorCreated.name}`](context: InstructorCreated): void {
    this._name = new InstructorName(context.name);
    this._followers = [];
  }

  [`on${InstructorNameUpdated.name}`](context: InstructorNameUpdated): void {
    this._name = new InstructorName(context.name);
  }

  [`on${InstructorFollowed.name}`](context: InstructorFollowed): void {
    this._followers.push(new UserId(context.user));
  }

  [`on${InstructorUnfollowed.name}`](context: InstructorUnfollowed): void {
    this._followers = this._followers.filter((follower) =>
      follower.equals(new UserId(context.user)),
    );
  }
}
