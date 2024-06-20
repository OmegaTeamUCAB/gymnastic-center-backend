import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MongoCategory,
  MongoComment,
  MongoInstructor,
  MongoUser,
  RabbitMQService,
} from '@app/core';
import { EventType } from './types';
import { MongoBlog } from '@app/core/infrastructure/models/mongo-blog.model';
import { MongoCourse } from '@app/core/infrastructure/models/mongo-course.model';


@Controller()
export class DatasyncController {
  constructor(
    private readonly rmqService: RabbitMQService,
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<MongoCategory>,
    @InjectModel(MongoUser.name)
    private readonly userModel: Model<MongoUser>,
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
    @InjectModel(MongoBlog.name)
    private readonly blogModel: Model<MongoBlog>,
    @InjectModel(MongoCourse.name)
    private readonly courseModel: Model<MongoCourse>,
    @InjectModel(MongoComment.name)
    private readonly commentModel: Model<MongoComment>,
  ) {}

  @EventPattern('health')
  async health(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Health check received', data);
    this.rmqService.ack(context);
  }

  @EventPattern('UserCreated')
  async onUserCreated(
    @Payload()
    data: EventType<{
      name: string;
      email: string;
      phone: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { name, email, phone } = data.context;
      await this.userModel.create({
        id: data.dispatcherId,
        name,
        email,
        phone,
      });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('UserNameUpdated')
  async onUserNameUpdated(
    @Payload()
    data: EventType<{
      name: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { name } = data.context;
      await this.userModel.updateOne({ id: data.dispatcherId }, { name });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('UserPhoneUpdated')
  async onUserPhoneUpdated(
    @Payload()
    data: EventType<{
      phone: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { phone } = data.context;
      await this.userModel.updateOne({ id: data.dispatcherId }, { phone });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('UserImageUpdated')
  async onUserImageUpdated(
    @Payload()
    data: EventType<{
      image: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { image } = data.context;
      await this.userModel.updateOne({ id: data.dispatcherId }, { image });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CategoryCreated')
  async onCategoryCreated(
    @Payload()
    data: EventType<{
      name: string;
      icon: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { name, icon } = data.context;
      await this.categoryModel.create({ id: data.dispatcherId, name, icon });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CategoryNameUpdated')
  async onCategoryNameUpdated(
    @Payload()
    data: EventType<{
      name: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { name } = data.context;
      await this.categoryModel.updateOne({ id: data.dispatcherId }, { name });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CategoryIconUpdated')
  async onCategoryIconUpdated(
    @Payload()
    data: EventType<{
      icon: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { icon } = data.context;
      await this.categoryModel.updateOne({ id: data.dispatcherId }, { icon });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('InstructorCreated')
  async onInstructorCreated(
    @Payload()
    data: EventType<{
      name: string;
      image: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { name, image } = data.context;
      await this.instructorModel.create({
        id: data.dispatcherId,
        name,
        image,
        followerCount: 0,
        followers: [],
      });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('InstructorNameUpdated')
  async onInstructorNameUpdated(
    @Payload()
    data: EventType<{
      name: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { name } = data.context;
      await this.instructorModel.updateOne({ id: data.dispatcherId }, { name });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('InstructorImageUpdated')
  async onInstructorImageUpdated(
    @Payload()
    data: EventType<{
      image: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { image } = data.context;
      await this.instructorModel.updateOne(
        { id: data.dispatcherId },
        { image },
      );
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('InstructorFollowed')
  async onInstructorFollowed(
    @Payload()
    data: EventType<{
      user: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { user } = data.context;
      await this.instructorModel.updateOne(
        { id: data.dispatcherId },
        { $push: { followers: user }, $inc: { followerCount: 1 } },
      );
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('InstructorUnfollowed')
  async onInstructorUnfollowed(
    @Payload()
    data: EventType<{
      user: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { user } = data.context;
      await this.instructorModel.updateOne(
        { id: data.dispatcherId },
        { $pull: { followers: user }, $inc: { followerCount: -1 } },
      );
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('BlogCreated')
  async onBlogCreated(
    @Payload()
    data: EventType<{
      title: string;
      content: string;
      creationDate: Date;
      images: string[];
      tags: string[];
      category: string;
      instructor: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const [category, instructor] = await Promise.all([
        this.categoryModel.findOne({ id: data.context.category }),
        this.instructorModel.findOne({ id: data.context.instructor }),
      ]);
      if (!category || !instructor) {
        this.rmqService.nack(context);
        return;
      }
      const { title, content, creationDate, images, tags } = data.context;
      await this.blogModel.create({
        id: data.dispatcherId,
        title,
        content,
        uploadDate: creationDate,
        images,
        tags,
        category: { id: category.id, name: category.name },
        trainer: { id: instructor.id, name: instructor.name },
        categoryId: category,
        trainerId: instructor,
      });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('BlogTitleUpdated')
  async onBlogTitleUpdated(
    @Payload()
    data: EventType<{
      title: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { title } = data.context;
      await this.blogModel.updateOne({ id: data.dispatcherId }, { title });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('BlogContentUpdated')
  async onBlogContentUpdated(
    @Payload()
    data: EventType<{
      content: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { content } = data.context;
      await this.blogModel.updateOne({ id: data.dispatcherId }, { content });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('BlogImagesUpdated')
  async onBlogImagesUpdated(
    @Payload()
    data: EventType<{
      images: string[];
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { images } = data.context;
      await this.blogModel.updateOne({ id: data.dispatcherId }, { images });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('BlogTagsUpdated')
  async onBlogTagsUpdated(
    @Payload()
    data: EventType<{
      tags: string[];
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { tags } = data.context;
      await this.blogModel.updateOne({ id: data.dispatcherId }, { tags });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('BlogCategoryUpdated')
  async onBlogCategoryUpdated(
    @Payload()
    data: EventType<{
      category: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const category = await this.categoryModel.findOne({
        id: data.context.category,
      });
      if (!category) {
        this.rmqService.nack(context);
        return;
      }
      await this.blogModel.updateOne(
        { id: data.dispatcherId },
        {
          category: {
            id: category.id,
            name: category.name,
          },
        },
      );
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CourseCreated')
  async onCourseCreated(
    @Payload()
    data: EventType<{
      name: string;
      description: string;
      level: number;
      tags: string[];
      weeks: number;
      minutes: number;
      image: string;
      category: string;
      instructor: string;
      publishDate: Date;
      lessons: {
        id: string;
        title: string;
        description: string;
        video: string;
      }[];
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const {
        name,
        description,
        level,
        tags,
        weeks,
        minutes,
        image,
        publishDate,
        lessons,
      } = data.context;
      const [category, instructor] = await Promise.all([
        this.categoryModel.findOne({ id: data.context.category }),
        this.instructorModel.findOne({ id: data.context.instructor }),
      ]);
      if (!category || !instructor) {
        this.rmqService.nack(context);
        return;
      }
      await this.courseModel.create({
        id: data.dispatcherId,
        title: name,
        description,
        level,
        tags,
        weeks,
        minutes,
        image,
        publishDate,
        category: {
          id: category.id,
          name: category.name,
        },
        trainer: {
          id: instructor.id,
          name: instructor.name,
        },
        lessons,
      });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CourseNameUpdated')
  async onCourseNameUpdated(
    @Payload()
    data: EventType<{
      name: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { name } = data.context;
      await this.courseModel.updateOne(
        { id: data.dispatcherId },
        { title: name },
      );
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CourseDescriptionUpdated')
  async onCourseDescriptionUpdated(
    @Payload()
    data: EventType<{
      description: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { description } = data.context;
      await this.courseModel.updateOne(
        { id: data.dispatcherId },
        { description },
      );
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CourseLevelUpdated')
  async onCourseLevelUpdated(
    @Payload()
    data: EventType<{
      level: number;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { level } = data.context;
      await this.courseModel.updateOne({ id: data.dispatcherId }, { level });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CourseTagsUpdated')
  async onCourseTagsUpdated(
    @Payload()
    data: EventType<{
      tags: string[];
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { tags } = data.context;
      await this.courseModel.updateOne({ id: data.dispatcherId }, { tags });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CourseDurationUpdated')
  async onCourseWeeksUpdated(
    @Payload()
    data: EventType<{
      weeks: number;
      minutes: number;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { weeks, minutes } = data.context;
      await this.courseModel.updateOne(
        { id: data.dispatcherId },
        { weeks, minutes },
      );
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CourseImageUpdated')
  async onCourseImageUpdated(
    @Payload()
    data: EventType<{
      image: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { image } = data.context;
      await this.courseModel.updateOne({ id: data.dispatcherId }, { image });
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CourseCategoryUpdated')
  async onCourseCategoryUpdated(
    @Payload()
    data: EventType<{
      category: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const category = await this.categoryModel.findOne({
        id: data.context.category,
      });
      if (!category) {
        this.rmqService.nack(context);
        return;
      }
      await this.courseModel.updateOne(
        { id: data.dispatcherId },
        {
          category: {
            id: category.id,
            name: category.name,
          },
        },
      );
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CommentCreated')
  async onCommentCreated(
    @Payload()
    data: EventType<{
      content: string;
      publisher: string;
      blog: string;
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { content, publisher, blog } = data.context;
      
      await this.commentModel.create({
        id: data.dispatcherId,
        content,
        blog,
        publisher,
        publishDate: new Date(),
        likes: [],
        dislikes: [],
      });

    //   await this.blogModel.updateOne(
    //     { id: blog }, 
    //     { $inc: { commentCount: 1 } });
    //   this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CommentLiked')
  async onCommentLiked(
    @Payload()
    data: EventType<{
      user: string
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { user } = data.context;
      await this.commentModel.updateOne(
        {id: data.dispatcherId},
        { $push: { likes: user }, $inc: { likes: 1 } },
      );
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CommentLikeRemoved')
  async onCommentLikeRemoved(
    @Payload()
    data: EventType<{
      user: string
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { user } = data.context;
      await this.commentModel.updateOne(
        {id: data.dispatcherId},
        { $pull: { likes: user }, $inc: { likes: -1 } },
      );
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CommentDisliked')
  async onCommentDisliked(
    @Payload()
    data: EventType<{
      user: string
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { user } = data.context;
      await this.commentModel.updateOne(
        {id: data.dispatcherId},
        { $push: { dislikes: user }, $inc: { dislikes: 1 } },
      );
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CommentDislikeRemoved')
  async onCommentDislikeRemoved(
    @Payload()
    data: EventType<{
      user: string
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { user } = data.context;
      await this.commentModel.updateOne(
        {id: data.dispatcherId},
        { $pull: { dislikes: user }, $inc: { dislikes: -1 } },
      );
      this.rmqService.ack(context);
    } catch (error) {}
  }

  @EventPattern('CommentDeleted')
  async onCommentDeleted(
    @Payload()
    data: EventType<{ }>,
    @Ctx() context: RmqContext,
  ) {
    try {



      console.log('antes de eliminar en el readmodel')
      await this.commentModel.deleteOne(
        {id: data.dispatcherId},
      );
      console.log('despues de eliminar en el readmodel')
      this.rmqService.ack(context);

      // await this.blogModel.updateOne(
      //   { id: blog }, 
      //   { $inc: { commentCount: -1 } });
    } catch (error) {}
  }
}
