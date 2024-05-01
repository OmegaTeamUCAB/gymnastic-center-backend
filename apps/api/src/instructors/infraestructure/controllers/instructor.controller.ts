import { Instructor as InstructorEntity } from '../../domain/entities/instructor.entity';
import { GetInstructorByIdQuery } from '../../application/queries/get-instructor-by-id/get-instructor-by-id.query';
import { GetInstructorByIdDto } from '../../application/queries/get-instructor-by-id/types/get-instructor-by-id.dto';
import { GetAllInstructors } from '../../application/queries/get-all-instructors/get-all-intructors.query';
import { MongoInstructorRepository } from '../repositories/mongo-instructor.repository';
import { Instructor as InstructorModel } from '../models/instructor.model';
import { Controller, Get, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('instructors')
export class InstructorsController {
    constructor(
        @InjectModel(InstructorModel.name) private readonly model: Model<InstructorEntity>) { }

    @Get(':id')
    findOneInstructor(@Param('id') id: string) {
        const data: GetInstructorByIdDto = { id };
        const repository = new MongoInstructorRepository(this.model);
        const getInstructorByIdQuery = new GetInstructorByIdQuery(repository);

        return getInstructorByIdQuery.execute(data);
    }

    @Get()
    findAllInstructors() {
        const repository = new MongoInstructorRepository(this.model);
        const getAllInstructors = new GetAllInstructors(repository);

        return getAllInstructors.execute();
    }
}