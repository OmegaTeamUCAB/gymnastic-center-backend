import { Given, When, Then, world } from '@cucumber/cucumber';
import { IdGeneratorMock } from 'apps/api/test/mocks/id-generator.mock';
import { Category } from 'apps/api/src/category/domain';
import {
    CategoryIcon,
    CategoryId,
    CategoryName,
} from 'apps/api/src/category/domain/value-objects';
import { InvalidCategoryNameException } from 'apps/api/src/category/domain/exceptions/invalid-category-name.exception';
import assert from 'assert';

Given('a category aggregate is created', () => {
    const idGenerator = new IdGeneratorMock();
    const category = Category.create(new CategoryId(idGenerator.generateId()), {
        name: new CategoryName(''),
        icon: new CategoryIcon('icon'),
    });
    world.category = category;
});


When ('the category name is empty', () => {
    const category: Category = world.category;
    assert.equal(category.name, '');
});


Then('it should not be created', () => {
    assert.throws(() => {
        throw new InvalidCategoryNameException();
    }, InvalidCategoryNameException);
});