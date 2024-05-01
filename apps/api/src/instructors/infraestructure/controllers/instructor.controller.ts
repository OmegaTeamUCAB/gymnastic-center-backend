import { Controller, Get, Param } from '@nestjs/common';
import { GetInstructorByIdQuery } from '../../application/queries/get-instructor-by-id/get-instructor-by-id.query';
import { GetInstructorByIdDto } from '../../application/queries/get-instructor-by-id/types/get-instructor-by-id.dto';
import { MongoInstructorRepository } from '../repositories/mongo-instructor.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Instructor as InstructorModel } from '../models/instructor.model';
import { Instructor as InstructorEntity } from '../../domain/entities/instructor.entity';

@Controller('instructors')
export class InstructorsController {
    constructor(
        @InjectModel(InstructorModel.name) private readonly model: Model<InstructorEntity>) { }

    @Get(':id')
    findOne(@Param('id') id: string) {
        let data: GetInstructorByIdDto = { id };

        const repository = new MongoInstructorRepository(this.model);

        const getInstructorByIdQuery = new GetInstructorByIdQuery(repository);

        return getInstructorByIdQuery.execute(data);
    }
}