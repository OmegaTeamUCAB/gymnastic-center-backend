import { DomainEvent } from "@app/core";
import { UserId } from "../value-objects";
import { UserImage } from "../value-objects/user-image";
import { DomainEventFactory } from "@app/core/domain/events/domain-event";

export type UserImageUpdatedEvent = DomainEvent<UserImageUpdated>;

export class UserImageUpdated {
  private constructor() {}
  image: string;

  static createEvent(
    dispatcher: UserId,
    userImage: UserImage
  ): UserImageUpdatedEvent {
    return DomainEventFactory<UserImageUpdated>({
      dispatcherId: dispatcher.value,
      name: UserImageUpdated.name,
      context: {
        ...(userImage && { image: userImage.value })
      },
    });
  }
}