import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { Given, Then, When } from '@cucumber/cucumber';
import { ToggleFollowCommandHandler } from 'apps/api/src/instructor/application/commands';
import { InstructorCreated } from 'apps/api/src/instructor/domain/events/instructor-created';
import { InstructorFollowed } from 'apps/api/src/instructor/domain/events/instructor-followed';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import { IdGeneratorMock } from 'apps/api/test/mocks/id-generator.mock';
import  assert  from 'assert';

const eventStore = new EventStoreMock();
const idGenerator = new IdGeneratorMock();
const service = new ToggleFollowCommandHandler(eventStore);
const userId = idGenerator.generateId();
const instructorId = idGenerator.generateId();

Given('The instructor is created', () => {
    eventStore.appendEvents(idGenerator.generateId(), [
        DomainEventFactory<InstructorCreated>({
        name: InstructorCreated.name,
        dispatcherId: instructorId,
        context: {
            name: 'Jose Perez',
            image: 'image.url.com',
            city: 'Caracas',
            country: 'Venezuela',
        },
        }),
    ]);
})

Given('The instructor is followed by the user', () => {
  eventStore.appendEvents(idGenerator.generateId(), [
    DomainEventFactory<InstructorFollowed>({
      name: InstructorFollowed.name,
      dispatcherId: instructorId,
      context: {
        user: userId,
      },
    }),
  ]);
});


When('The user toggle the follow button on the instructor', async () => {
    await service.execute({
        instructorId,
        userId,
    });
})

Then('The follow should be removed from the instructor', async () => {
    const events = await eventStore.getEventsByStream(instructorId);
    assert.strictEqual(events.length, 3);
    assert.strictEqual(events[1].name, InstructorFollowed.name);
    assert.deepEqual(events[1].context, { user: userId });
})