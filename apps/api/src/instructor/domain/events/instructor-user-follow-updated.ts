import { DomainEvent } from "@app/core";
import { InstructorId, InstructorUserFollow } from "../value-objects";
import { DomainEventFactory } from "@app/core/domain/events/domain-event";

export type InstructorUserFollowUpdatedEvent = DomainEvent<InstructorUserFollowUpdated>;

export class InstructorUserFollowUpdated {
  private constructor() {}
  userFollow: boolean;
  static createEvent(
    dispatcher: InstructorId,
    instructorFollowUser: InstructorUserFollow,
  ): InstructorUserFollowUpdatedEvent {
    return DomainEventFactory<InstructorUserFollowUpdated>({
      dispatcherId: dispatcher.value,
      name: InstructorUserFollowUpdated.name,
      context: {
        userFollow: instructorFollowUser.value,
      },
    });
  }
}