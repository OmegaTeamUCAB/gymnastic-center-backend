import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { Given, world } from '@cucumber/cucumber';
import { CategoryNameUpdated } from 'apps/api/src/category/domain/events';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';

Given(
    'a category aggregate is updated',
    (categoryName: string) => {
    const eventStore: EventStoreMock = world.eventStore;
    eventStore.appendEvents(world.categoryId, [
        DomainEventFactory<CategoryNameUpdated>({
            name: CategoryNameUpdated.name,
            dispatcherId: world.categoryId,
            context: {
                name: categoryName,
            },
        }),
    ]);
});
