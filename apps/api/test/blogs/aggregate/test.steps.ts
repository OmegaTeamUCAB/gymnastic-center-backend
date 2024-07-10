import { Then, When } from '@cucumber/cucumber';
import { CreateBlogCommandHandler } from 'apps/api/src/blog/application';
import { InvalidCategoryIdException } from 'apps/api/src/category/domain/exceptions/invalid-category-id.exception';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import { IdGeneratorMock } from 'apps/api/test/mocks/id-generator.mock';
import assert from 'assert';

const eventStore = new EventStoreMock();
const idGenerator = new IdGeneratorMock();
const service = new CreateBlogCommandHandler(idGenerator, eventStore);
let caughtError;

When('Trying to create a blog with invalid data', async () => {
  try {
    await service.execute({
      images: [],
      tags: [],
      title: 'Blog Erroneo',
      category: '',
      content: 'Este es un blog que debe fallar a la hora de la creacion',
      instructor: 'sip',
    });
  } catch (error) {
    caughtError = error;
  }
});

Then('The blog should not be created', async () => {
  assert.ok(
      caughtError instanceof InvalidCategoryIdException 
  );
});