import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Gender, Stat } from "../../domain/entities";

export type UserDocument = HydratedDocument<MongoUser>;

@Schema({collection: 'users', timestamps: true, versionKey: false})
export class MongoUser{

    @Prop({
        required: true,
        unique: true
    })
    id: string;

    @Prop({
        required: true
    })
    name: string;

    @Prop({
        required: true
    })
    lastName: string;

    @Prop({
        required: true,
        unique: true
    })
    email: string;

    @Prop({
        required: true,
        unique: true
    })
    phoneNumber: string;

    @Prop({
        required: true
    })
    password: string;

    @Prop({
        required: true
    })
    birthDate: Date;

    @Prop({
        required: true,
        type: String
    })
    gender: Gender;

    @Prop({
        required: true,
        type: [{type: Stat}]
    })
    stats: Stat[];

    createdAt: Date;
    
    updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(MongoUser);