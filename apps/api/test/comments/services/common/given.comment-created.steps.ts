import { Given, world } from '@cucumber/cucumber';
import { EventStoreMock } from '../../../mocks/event-store.mock';
import { IdGeneratorMock } from '../../../mocks/id-generator.mock';
import { CommentCreated } from 'apps/api/src/comment/domain/events';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';

Given('the comment is created', () => {
  const eventStore = new EventStoreMock();
  const idGenerator = new IdGeneratorMock();
  const commentId = idGenerator.generateId();
  eventStore.appendEvents(idGenerator.generateId(), [
    DomainEventFactory<CommentCreated>({
      name: CommentCreated.name,
      dispatcherId: commentId,
      context: {
        date: new Date(),
        content: 'content',
        blog: idGenerator.generateId(),
        publisher: idGenerator.generateId(),
      },
    }),
  ]);
  world.eventStore = eventStore;
  world.commentId = commentId;
});
