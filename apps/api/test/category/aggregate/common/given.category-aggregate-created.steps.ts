import { Given, world } from '@cucumber/cucumber';
import { IdGeneratorMock } from 'apps/api/test/mocks/id-generator.mock';
import { Category } from 'apps/api/src/category/domain';
import {
    CategoryIcon,
    CategoryId,
    CategoryName,
} from 'apps/api/src/category/domain/value-objects';

Given('the category aggregate is created', () => {
    const idGenerator = new IdGeneratorMock();
    const category = Category.create(new CategoryId(idGenerator.generateId()), {
        name: new CategoryName(''),
        icon: new CategoryIcon('icon'),
    });
    world.category = category;
});