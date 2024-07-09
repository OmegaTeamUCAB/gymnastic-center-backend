import { When, world } from '@cucumber/cucumber';
import { Comment } from 'apps/api/src/comment/domain';

When('the publisher deletes the comment aggregate', () => {
  const comment: Comment = world.comment;
  comment.delete(comment.publisher);
});
