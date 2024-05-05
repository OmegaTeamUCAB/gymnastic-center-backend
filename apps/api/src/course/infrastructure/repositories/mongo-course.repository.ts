import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CourseDocument, MongoCourse } from '../models/mongo-course.model';
import { Comment, Course, CourseRepository, Lesson } from '../../domain';

@Injectable()
export class MongoCourseRepository implements CourseRepository {
  constructor(
    @InjectModel(MongoCourse.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  async saveCourse(course: Course): Promise<void> {
    await this.courseModel.updateOne(
      {
        aggregateId: course.id,
      },
      {
        $set: {
          title: course.name,
          description: course.description,
          level: course.level,
          tags: course.tags,
          weeks: course.weeks,
          minutes: course.minutes,
          imageUrl: course.imageUrl,
          categoryId: course.categoryId,
          instructorId: course.instructorId,
          lessons: course.lessons.map((lesson) => ({
            entityId: lesson.id,
            title: lesson.title,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            imageUrl: lesson.imageUrl,
            comments: lesson.comments.map((comment) => ({
              entityId: comment.id,
              userId: comment.userId,
              comment: comment.content,
              creationDate: comment.createdAt,
            })),
          })),
          creationDate: course.createdAt,
          lastUpdate: course.updatedAt,
        },
      },
      {
        upsert: true,
      },
    );
  }

  async getCourseById(id: string): Promise<Course | null> {
    const course = await this.courseModel.findOne({
      aggregateId: id,
    });
    return course ? this.fromDocumentToEntity(course) : null;
  }

  async getCoursesByCategoryId(categoryId: string): Promise<Course[]> {
    const courses = await this.courseModel.find({
      categoryId,
    });
    return courses.map((course) => this.fromDocumentToEntity(course));
  }

  async getCoursesByInstructorId(instructorId: string): Promise<Course[]> {
    const courses = await this.courseModel.find({
      instructorId,
    });
    return courses.map((course) => this.fromDocumentToEntity(course));
  }

  async getCourses(): Promise<Course[]> {
    const courses = await this.courseModel.find();
    return courses.map((course) => this.fromDocumentToEntity(course));
  }

  private fromDocumentToEntity(document: CourseDocument): Course {
    return new Course(
      document.aggregateId,
      document.title,
      document.description,
      document.level,
      document.tags,
      document.weeks,
      document.minutes,
      document.imageUrl,
      document.categoryId,
      document.instructorId,
      document.lessons.map(
        (lesson) =>
          new Lesson(
            lesson.entityId,
            lesson.title,
            lesson.comments.map(
              (comment) =>
                new Comment(
                  comment.entityId,
                  comment.userId,
                  comment.comment,
                  comment.creationDate,
                ),
            ),
            lesson.content,
            lesson.videoUrl,
            lesson.imageUrl,
          ),
      ),
      document.creationDate,
      document.lastUpdate,
    );
  }
}
