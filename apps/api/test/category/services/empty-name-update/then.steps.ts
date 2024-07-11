import { Then } from '@cucumber/cucumber';
import { InvalidCategoryNameException } from 'apps/api/src/category/domain/exceptions/invalid-category-name.exception';
import assert from 'assert';

Then('it should not be updated', () => {
    assert.throws(() => {
        throw new InvalidCategoryNameException();
    }, InvalidCategoryNameException);
});