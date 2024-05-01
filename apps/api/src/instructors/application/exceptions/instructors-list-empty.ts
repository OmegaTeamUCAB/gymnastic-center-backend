import { ApplicationException } from '@app/core';

export class InstructorsListEmpty extends ApplicationException {
    constructor() {
        super('Instructors list is empty');
    }
}