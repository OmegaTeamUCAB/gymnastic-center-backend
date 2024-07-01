import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type CommentDocument = HydratedDocument<MongoQuestion>;

@Schema({ collection: 'questions', timestamps: false, versionKey: false })
export class MongoQuestion {
  readonly _id: string;

  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.UUID,
  })
  id: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    type: SchemaTypes.UUID,
    required: true,
  })
  lesson: string;

  @Prop({
    type: {
      id: {
        type: SchemaTypes.UUID,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: false,
      },
      _id: false,
    },
    required: true,
  })
  publisher: {
    id: string;
    name: string;
    image?: string;
  };

  @Prop({
    required: false,
    type: {
      instructorName: {
        type: String,
        required: true,
      },
      instructorImage: {
        type: String,
        required: false,
      },
      answer: {
        type: String,
        required: true,
      },
      _id: false,
    },
  })
  answer?: {
    instructorName: string;
    instructorImage?: string;
    answer: string;
  };

  @Prop({
    required: true,
  })
  publishDate: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(MongoQuestion);
QuestionSchema.index({ lesson: 1, publishDate: -1 });
