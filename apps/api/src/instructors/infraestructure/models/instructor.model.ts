import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type InstructorDocument = HydratedDocument<Instructor>;

@Schema({ timestamps: true, versionKey: false })
export class Instructor {

    @Prop({ minlength: 20 })
    readonly _id: string;

    @Prop({
        required: true,
        unique: true,
    })
    aggregateId: string;

    @Prop({ required: true, minlength: 1 })
    name: string;

    @Prop({ required: true, minlength: 1 })
    lastName: string;

    @Prop({ required: true })
    birthDate: Date;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, minlength: 4 })
    gender: string;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);