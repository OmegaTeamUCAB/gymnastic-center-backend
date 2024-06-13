import { DomainEvent } from "@app/core";
import { UserId, UserName } from "../value-objects";
import { DomainEventFactory } from "@app/core/domain/events/domain-event";

export type UserNameUpdatedEvent = DomainEvent<UserNameUpdated>;

export class UserNameUpdated {
    private constructor() {};

    name: string;

    static createEvent(
        dispatcher: UserId,
        userName: UserName
    ): UserNameUpdatedEvent {
        return DomainEventFactory<UserNameUpdated>({
            dispatcherId: dispatcher.value,
            name: UserNameUpdated.name,
            context: {
                name: userName.value,
            }
        });
    }
}