import { When, world } from '@cucumber/cucumber';
import { Category } from 'apps/api/src/category/domain';
import assert from 'assert';

When ('the category name is empty', () => {
    const category: Category = world.category;
    assert.equal(category.name, '');
});