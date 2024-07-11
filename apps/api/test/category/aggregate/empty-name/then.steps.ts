import { Then } from '@cucumber/cucumber';
import { InvalidCategoryNameException } from 'apps/api/src/category/domain/exceptions/invalid-category-name.exception';
import assert from 'assert';

Then('an InvalidCategoryNameException should be thrown', () => {
    assert.throws(() => {
        throw new InvalidCategoryNameException();
    }, InvalidCategoryNameException);
});