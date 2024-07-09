import { Then, world } from '@cucumber/cucumber';
import { Comment } from 'apps/api/src/comment/domain';
import { CommentDeletedException } from 'apps/api/src/comment/domain/exceptions';
import { UserId } from 'apps/api/src/user/domain/value-objects';
import { IdGeneratorMock } from 'apps/api/test/mocks/id-generator.mock';
import assert from 'assert';

Then('the comment should be immutable', () => {
  const idGenerator = new IdGeneratorMock();
  const comment: Comment = world.comment;
  assert.strictEqual(comment.isActive(), false);
  assert.throws(
    () => comment.addLike(new UserId(idGenerator.generateId())),
    CommentDeletedException,
  );
  assert.throws(
    () => comment.removeLike(new UserId(idGenerator.generateId())),
    CommentDeletedException,
  );
  assert.throws(
    () => comment.addDislike(new UserId(idGenerator.generateId())),
    CommentDeletedException,
  );
  assert.throws(
    () => comment.removeDislike(new UserId(idGenerator.generateId())),
    CommentDeletedException,
  );
  assert.throws(
    () => comment.delete(new UserId(idGenerator.generateId())),
    CommentDeletedException,
  );
});
