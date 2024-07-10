import { When, world } from '@cucumber/cucumber';
import { ToggleDislikeCommandHandler } from 'apps/api/src/comment/application/commands/toggle-dislike/toggle-dislike.command-handler';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';

When(
  'the user with id {string} toggle the dislike button on the comment',
  async (userId: string) => {
    const commentId: string = world.commentId;
    const service = new ToggleDislikeCommandHandler(
      world.eventStore as EventStoreMock,
    );
    await service.execute({
      commentId,
      userId,
    });
  },
);
