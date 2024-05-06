import { InstructorRepository } from '../../domain/repositories/instructor.repository.interface';
import { Instructor } from '../../domain/entities/instructor.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class MongoInstructorRepository implements InstructorRepository {

    constructor(@InjectModel(Instructor.name) private readonly datasource: Model<Instructor>) { }

    async findAllInstructors(): Promise<Instructor[]> {
        const instructors = await this.datasource.find();
        if (!instructors) return [];

        return instructors;
    }

    async findOneInstructor(id: string): Promise<Instructor> {
        const instructor = await this.datasource.findById(id);
        if (!instructor) return null;

        return instructor;
    }
}