import { Given, world } from '@cucumber/cucumber';
import { IdGeneratorMock } from '../../../mocks/id-generator.mock';
import { Comment } from 'apps/api/src/comment/domain';
import {
  CommentContent,
  CommentId,
} from 'apps/api/src/comment/domain/value-objects';
import { BlogId } from 'apps/api/src/blog/domain/value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';

Given('the comment aggregate is created', () => {
  const idGenerator = new IdGeneratorMock();
  const comment = Comment.create(new CommentId(idGenerator.generateId()), {
    content: new CommentContent('content'),
    blog: new BlogId(idGenerator.generateId()),
    publisher: new UserId(idGenerator.generateId()),
  });
  world.comment = comment;
});
