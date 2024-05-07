import { Instructor as InstructorEntity } from '../../domain/entities/instructor.entity';
import { GetInstructorByIdQuery } from '../../application/queries/get-instructor-by-id/get-instructor-by-id.query';
import { GetInstructorByIdDto } from '../../application/queries/get-instructor-by-id/types/get-instructor-by-id.dto';
import { GetAllInstructors } from '../../application/queries/get-all-instructors/get-all-intructors.query';
import { MongoInstructorRepository } from '../repositories/mongo-instructor.repository';
import { Instructor as InstructorModel } from '../models/instructor.model';
import { InstructorResponse } from '../responses/instructor.response';
import { Controller, Get, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('instructors')
@ApiTags('Instructors')
export class InstructorsController {
    constructor(
        @InjectModel(InstructorModel.name) private readonly model: Model<InstructorEntity>) { }

    @ApiResponse({
        status: 200,
        description: 'The instructor has been successfully found',
        type: [InstructorResponse],
    })
    @ApiResponse({
        status: 404,
        description: 'Instructor not found',
    })
    @Get(':id')
    findOneInstructor(@Param('id') id: string) {
        const data: GetInstructorByIdDto = { id };
        const repository = new MongoInstructorRepository(this.model);
        const getInstructorByIdQuery = new GetInstructorByIdQuery(repository);

        return getInstructorByIdQuery.execute(data);
    }

    @ApiResponse({
        status: 200,
        description: 'Instructors list',
        type: [InstructorResponse],
    })
    @Get()
    async findAllInstructors() {
        const repository = new MongoInstructorRepository(this.model);
        const getAllInstructors = new GetAllInstructors(repository);
        const result = await getAllInstructors.execute()
        return result.unwrap();
    }
}