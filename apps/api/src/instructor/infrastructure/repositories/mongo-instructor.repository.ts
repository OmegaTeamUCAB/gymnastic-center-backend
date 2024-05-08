import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstructorDocument, MongoInstructor } from '../models/instructor.model';
import { Instructor } from '../../domain/entities/instructor.entity';
import { InstructorRepository } from '../../domain/repositories/instructor.repository.interface';

@Injectable()
export class MongoInstructorRepository implements InstructorRepository {
  constructor(
    @InjectModel(MongoInstructor.name)
    private readonly datasource: Model<InstructorDocument>,
  ) {}

  async getInstructors(): Promise<Instructor[]> {
    const instructors = await this.datasource.find();
    if (!instructors) return [];
    return instructors.map(
      ({ aggregateId, name, lastName, birthDate, email, gender }) =>
        new Instructor(aggregateId, name, lastName, birthDate, email, gender),
    );
  }

  async getInstructorById(id: string): Promise<Instructor> {
    const instructor = await this.datasource.findById(id);
    if (!instructor) return null;
    return new Instructor(
      instructor.aggregateId,
      instructor.name,
      instructor.lastName,
      instructor.birthDate,
      instructor.email,
      instructor.gender,
    );
  }
}
