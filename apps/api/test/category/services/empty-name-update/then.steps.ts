import { Then, world } from '@cucumber/cucumber';
import { CategoryNameUpdated } from 'apps/api/src/category/domain/events';
import { InvalidCategoryNameException } from 'apps/api/src/category/domain/exceptions/invalid-category-name.exception';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import assert from 'assert';

Then('it should not be updated', async () => {
    const id: string = world.categoryId;
    const eventStore: EventStoreMock = world.eventStore;
    const result = world.result;
    const events = await eventStore.getEventsByStream(id);
    assert.ok(events.length >= 2);
    assert.strictEqual(events[events.length - 1].name, CategoryNameUpdated.name);
    assert(result.isFailure())
    assert(result.unwrap instanceof InvalidCategoryNameException)
},);