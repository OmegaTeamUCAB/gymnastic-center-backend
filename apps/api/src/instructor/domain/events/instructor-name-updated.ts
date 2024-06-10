import { DomainEvent } from "@app/core";
import { InstructorId, InstructorName } from "../value-objects";
import { DomainEventFactory } from "@app/core/domain/events/domain-event";

export type InstructorNameUpdatedEvent = DomainEvent<InstructorNameUpdated>;

export class InstructorNameUpdated {
    private constructor() {}
    name: string;
    static createEvent(
        dispatcher: InstructorId,
        instructorName: InstructorName, 
    ): InstructorNameUpdatedEvent{
        return DomainEventFactory<InstructorNameUpdated>({
            dispatcherId: dispatcher.value,
            name: InstructorNameUpdated.name,
            context: {
                name: instructorName.value,
            },
        });
    }
}