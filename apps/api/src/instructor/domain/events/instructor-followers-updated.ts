import { DomainEvent } from "@app/core";
import { InstructorFollowers, InstructorId } from "../value-objects";
import { DomainEventFactory } from "@app/core/domain/events/domain-event";

export type InstructorFollowersUpdatedEvent = DomainEvent<InstructorFollowersUpdated>;

export class InstructorFollowersUpdated {
    private constructor() {}
    followers: InstructorFollowers;
    static createEvent(
        dispatcher: InstructorId,
        followers: InstructorFollowers,
    ): InstructorFollowersUpdatedEvent {
        return DomainEventFactory<InstructorFollowersUpdated>({
            dispatcherId: dispatcher.value,
            name: InstructorFollowersUpdated.name,
            context: {
                followers: followers,
            },
        });
    }
}