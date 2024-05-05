import { ApplicationService, Result, IdGenerator } from '@app/core';
import { CommentLessonDto, CommentLessonResponse } from './types';
import { Comment, CourseRepository } from '../../../domain';
import {
  CourseNotFoundException,
  LessonNotFoundException,
} from '../../exceptions';

export class CommentLessonCommand
  implements ApplicationService<CommentLessonDto, CommentLessonResponse>
{
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly idGenerator: IdGenerator<string>,
  ) {}

  async execute(
    data: CommentLessonDto,
  ): Promise<Result<CommentLessonResponse>> {
    const course = await this.courseRepository.getCourseById(data.courseId);
    if (!course)
      return Result.failure<CommentLessonResponse>(
        new CourseNotFoundException(),
      );
    const lesson = course.lessons.find((lesson) => lesson.id === data.lessonId);
    if (!lesson)
      return Result.failure<CommentLessonResponse>(
        new LessonNotFoundException(),
      );
    const id = this.idGenerator.generateId();
    lesson.comments.push(
      new Comment(id, data.userId, data.content, new Date()),
    );
    await this.courseRepository.saveCourse(course);
    return Result.success<CommentLessonResponse>({
      commentId: id,
    });
  }
}
