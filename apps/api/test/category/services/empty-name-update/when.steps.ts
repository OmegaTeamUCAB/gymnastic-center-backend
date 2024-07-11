import { When, world } from '@cucumber/cucumber';
import { UpdateCategoryResponse } from 'apps/api/src/category/application/commands/update-category/types/response.type'
import { UpdateCategoryCommandHandler } from 'apps/api/src/category/application/commands';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import { Result } from '@app/core/utils/result'

When (
    'the category name is empty', 
    async () => {
        const id: string = world.categoryId;
        const name: string = '';
        const service = new UpdateCategoryCommandHandler(
            world.eventStore as EventStoreMock,
        );
        const result: Result<UpdateCategoryResponse> = await service.execute({
            id,
            name,
        });
        world.result = result;
    },
);