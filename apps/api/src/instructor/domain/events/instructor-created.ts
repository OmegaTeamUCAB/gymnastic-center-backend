import { DomainEvent } from "@app/core";
import { InstructorFollowers, InstructorId, InstructorName } from "../value-objects";
import { InstructorAddressUpdated } from "./instructor-address-updated";
import { DomainEventFactory } from "@app/core/domain/events/domain-event";

export type InstructorCreatedEvent = DomainEvent<InstructorCreated>;

export class InstructorCreated {
    private constructor() {}
    name: string;
    country: string;
    city: string;
    followers: number;
    static createEvent(
        dispatcher: InstructorId,
        instructorName: InstructorName,
        instructorAddress: InstructorAddressUpdated,
        instructorFollowers: InstructorFollowers,
    ): InstructorCreatedEvent {
        return DomainEventFactory<InstructorCreated>({
            dispatcherId: dispatcher.value,
            name: InstructorCreated.name,
            context: {
                name: instructorName.value,
                country: instructorAddress.country,
                city: instructorAddress.city,
                followers: instructorFollowers.value,
            },
        });
    }
}