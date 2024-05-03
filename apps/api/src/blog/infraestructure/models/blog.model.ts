import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ collection: 'blogs', timestamps: true, versionKey: false })
export class MongoBlog {
    readonly _id: string;

    @Prop({
        required: true,
        unique: true,
    })
    aggregateId: string;
    
    @Prop({ required: true })
    imageUrl: string;

    @Prop({ required: true, minlength: 5 })
    title: string;

    @Prop({ required: true, minlength: 5 })
    description: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    uploadDate: Date;

    readonly createdat: Date;

    readonly updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(MongoBlog);