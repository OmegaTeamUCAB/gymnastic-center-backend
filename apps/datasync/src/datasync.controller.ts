import { Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MongoCategory,
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
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { name } = data.context;
      await this.instructorModel.create({
        id: data.dispatcherId,
        name,
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
      const {
        title,
        content,
        creationDate,
        images,
        tags,
        category,
        instructor,
      } = data.context;
      await this.blogModel.create({
        id: data.dispatcherId,
        title,
        content,
        uploadDate: creationDate,
        images,
        tags,
        category: { id: category, name: 'Programming' },
        trainer: { id: instructor, name: 'Calo' },
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
      const { category } = data.context;
      await this.blogModel.updateOne({ id: data.dispatcherId }, { category });
      this.rmqService.ack(context);
    } catch (error) {}
  }


  @EventPattern('CourseCreated')
  async onCourseCreated(
    @Payload()
    data: EventType<{
      title: string;
      description: string;
      level: number;
      tags: string[];
      weeks: number;
      minutes: number;
      imageUrl: string;
      categoryId: string;
      instructorId: string;
      lessons: {
        id: string;
        title: string;
        video: string;
        description: string;
      }[];
    }>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const {
        title,
        description,
        level,
        tags,
        weeks,
        minutes,
        imageUrl,
        categoryId,
        instructorId,
        lessons,
      } = data.context;
      await this.courseModel.create({
        id: data.dispatcherId,
        title,
        description,
        level,
        tags,
        weeks,
        minutes,
        imageUrl,
        categoryId,
        instructorId,
        lessons,
      });
      this.rmqService.ack(context);
    } catch (error) {}
  }

   @EventPattern('CourseNameUpdated')
  async onCourseNameUpdated(
    @Payload()
    data: EventType<{
      title: string;
    }>,
    @Ctx() context: RmqContext,){
    try {
      const { title } = data.context;
      await this.courseModel.updateOne({ id: data.dispatcherId }, { title });
      this.rmqService.ack(context);
    } catch (error) {}
    }

  @EventPattern('CourseDescriptionUpdated')
  async onCourseDescriptionUpdated(
    @Payload()
    data: EventType<{
      description: string;
    }>,
    @Ctx() context: RmqContext,){
    try {
      const { description } = data.context;
      await this.courseModel.updateOne({ id: data.dispatcherId }, { description });
      this.rmqService.ack(context);
    } catch (error) {}
    }

  @EventPattern('CourseLevelUpdated')
  async onCourseLevelUpdated(
    @Payload()
    data: EventType<{
      level: number;
    }>,
    @Ctx() context: RmqContext,){
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
    @Ctx() context: RmqContext,){
    try {
      const { tags } = data.context;
      await this.courseModel.updateOne({ id: data.dispatcherId }, { tags });
      this.rmqService.ack(context);
    } catch (error) {}
    }

  @EventPattern('CourseWeeksUpdated')
  async onCourseWeeksUpdated(
    @Payload()
    data: EventType<{
      weeks: number;
    }>,
    @Ctx() context: RmqContext,){
    try {
      const { weeks } = data.context;
      await this.courseModel.updateOne({ id: data.dispatcherId }, { weeks });
      this.rmqService.ack(context);
    } catch (error) {}
    }

  @EventPattern('CourseMinutesUpdated')
  async onCourseMinutesUpdated(
    @Payload()
    data: EventType<{
      minutes: number;
    }>,
    @Ctx() context: RmqContext,){
    try {
      const { minutes } = data.context;
      await this.courseModel.updateOne({ id: data.dispatcherId }, { minutes });
      this.rmqService.ack(context);
    } catch (error) {}
    }

  @EventPattern('CourseImageUpdated')
  async onCourseImageUpdated(
    @Payload()
    data: EventType<{
      imageUrl: string;
    }>,
    @Ctx() context: RmqContext,){
    try {
      const { imageUrl } = data.context;
      await this.courseModel.updateOne({ id: data.dispatcherId }, { imageUrl });
      this.rmqService.ack(context);
    } catch (error) {}
    }

  @EventPattern('CourseCategoryUpdated')
  async onCourseCategoryUpdated(
    @Payload()
    data: EventType<{
      categoryId: string;
    }>,
    @Ctx() context: RmqContext,){
    try {
      const { categoryId } = data.context;
      await this.courseModel.updateOne({ id: data.dispatcherId }, { categoryId });
      this.rmqService.ack(context);
    } catch (error) {}
    }
}
