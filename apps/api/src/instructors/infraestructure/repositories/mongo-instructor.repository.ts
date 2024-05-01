import { Injectable } from '@nestjs/common';
import { Instructor } from '../../domain/entities/instructor.entity';
import { InstructorRepository } from '../../domain/repositories/instructor.repository.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongoInstructorRepository implements InstructorRepository {

    constructor(@InjectModel(Instructor.name) private readonly datasource: Model<Instructor>) { }

    async findAll(): Promise<Instructor[]> {
        const users = await this.datasource.find();
        if (!users) return [];

        return users;
    }

    async findOne(id: string): Promise<Instructor> {
        const user = await this.datasource.findById(id);
        if (!user) return null;

        return user;
    }
}