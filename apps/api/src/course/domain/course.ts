import {
  CourseAlreadyStartedByUserException,
  InvalidCourseException,
  CourseNotStartedByUserException,
} from './exceptions';
import {
  CourseDescription,
  CourseDuration,
  CourseId,
  CourseImage,
  CourseLevel,
  CourseName,
  CoursePublishDate,
  CourseTag,
} from './value-objects';
import { CategoryId } from '../../category/domain/value-objects/category-id';
import { InstructorId } from '../../instructor/domain/value-objects/instructor-id';
import { AggregateRoot, DomainEvent } from '@app/core';
import { Lesson } from './entities/lessons/lesson';
import {
  CourseCategoryUpdated,
  CourseCreated,
  CourseDescriptionUpdated,
  CourseDurationUpdated,
  CourseImageUpdated,
  CourseLevelUpdated,
  CourseNameUpdated,
  CourseStarted,
  CourseTagsUpdated,
  CourseLessonWatched,
  CourseCompleted,
} from './events';
import {
  LessonDescription,
  LessonId,
  LessonTitle,
  LessonVideo,
} from './entities/lessons/value-objects';
import { UserProgress } from './entities/user-progress/user-progress';
import { UserId } from '../../user/domain/value-objects';
import {
  CompletionPercentage,
  LastSecondWatched,
} from './entities/user-progress/value-objects';

export class Course extends AggregateRoot<CourseId> {
  private constructor(id: CourseId) {
    super(id);
  }

  protected validateState(): void {
    if (
      !this.id ||
      !this._name ||
      !this._description ||
      !this._level ||
      !this._tags ||
      !this._image ||
      this._lessons.length === 0 ||
      !this._duration ||
      !this._category ||
      !this._instructor ||
      !this._publishDate ||
      !this._progressHistory ||
      this._progressHistory.some(
        (progress) =>
          !this.lessons.find((lesson) => lesson.id.equals(progress.lesson)),
      )
    ) {
      throw new InvalidCourseException();
    }
  }

  private _name: CourseName;
  private _description: CourseDescription;
  private _level: CourseLevel;
  private _tags: CourseTag[];
  private _duration: CourseDuration;
  private _publishDate: CoursePublishDate;
  private _image: CourseImage;
  private _category: CategoryId;
  private _instructor: InstructorId;
  private _lessons: Lesson[];
  private _progressHistory: UserProgress[];

  get name(): CourseName {
    return this._name;
  }

  get description(): CourseDescription {
    return this._description;
  }

  get level(): CourseLevel {
    return this._level;
  }

  get tags(): CourseTag[] {
    return this._tags;
  }

  get image(): CourseImage {
    return this._image;
  }

  get category(): CategoryId {
    return this._category;
  }

  get instructor(): InstructorId {
    return this._instructor;
  }

  get duration(): CourseDuration {
    return this._duration;
  }

  get publishDate(): CoursePublishDate {
    return this._publishDate;
  }

  get lessons(): Lesson[] {
    return this._lessons;
  }

  updateName(name: CourseName): void {
    this.apply(CourseNameUpdated.createEvent(this.id, name));
  }

  updateDescription(description: CourseDescription): void {
    this.apply(CourseDescriptionUpdated.createEvent(this.id, description));
  }

  updateLevel(level: CourseLevel): void {
    this.apply(CourseLevelUpdated.createEvent(this.id, level));
  }

  updateTags(tags: CourseTag[]): void {
    this.apply(CourseTagsUpdated.createEvent(this.id, tags));
  }

  updateImages(image: CourseImage): void {
    this.apply(CourseImageUpdated.createEvent(this.id, image));
  }

  updateCategory(categoryId: CategoryId): void {
    this.apply(CourseCategoryUpdated.createEvent(this.id, categoryId));
  }

  updateDuration(duration: CourseDuration): void {
    this.apply(CourseDurationUpdated.createEvent(this.id, duration));
  }

  isBeingWatchedBy(user: UserId): boolean {
    return this._progressHistory.some((progress) => progress.user.equals(user));
  }

  isCompletedBy(user: UserId): boolean {
    return this._progressHistory.every((progress) =>
      progress.user.equals(user) ? progress.isCompleted : true,
    );
  }

  startWatching(user: UserId): void {
    if (this.isBeingWatchedBy(user))
      throw new CourseAlreadyStartedByUserException();
    this.apply(CourseStarted.createEvent(this.id, user));
  }

  watchLesson(
    lesson: LessonId,
    user: UserId,
    lastTime: LastSecondWatched,
    progress: CompletionPercentage,
  ): void {
    const lessonProgress = this._progressHistory.find(
      (progress) =>
        progress.user.equals(user) && progress.lesson.equals(lesson),
    );
    if (!lessonProgress) throw new CourseNotStartedByUserException();
    this.apply(
      CourseLessonWatched.createEvent(
        this.id,
        user,
        lesson,
        progress,
        lastTime,
      ),
    );
  }

  static create(
    id: CourseId,
    data: {
      name: CourseName;
      description: CourseDescription;
      level: CourseLevel;
      tags: CourseTag[];
      duration: CourseDuration;
      lessons: Lesson[];
      image: CourseImage;
      category: CategoryId;
      instructor: InstructorId;
    },
  ): Course {
    const course = new Course(id);
    course.apply(
      CourseCreated.createEvent(
        id,
        data.name,
        data.description,
        data.level,
        data.tags,
        data.duration,
        data.image,
        data.category,
        data.instructor,
        new CoursePublishDate(new Date()),
        data.lessons,
      ),
    );
    return course;
  }

  static loadFromHistory(id: CourseId, events: DomainEvent[]): Course {
    const course = new Course(id);
    course.hydrate(events);
    return course;
  }

  [`on${CourseCreated.name}`](context: CourseCreated): void {
    this._name = new CourseName(context.name);
    this._description = new CourseDescription(context.description);
    this._level = new CourseLevel(context.level);
    this._tags = context.tags.map((tag) => new CourseTag(tag));
    this._image = new CourseImage(context.image);
    this._duration = new CourseDuration(context.weeks, context.minutes);
    this._publishDate = new CoursePublishDate(context.publishDate);
    this._category = new CategoryId(context.category);
    this._instructor = new InstructorId(context.instructor);
    this._lessons = context.lessons.map(
      (lesson) =>
        new Lesson(
          new LessonId(lesson.id),
          new LessonTitle(lesson.title),
          new LessonDescription(lesson.description),
          new LessonVideo(lesson.video),
        ),
    );
    this._progressHistory = [];
  }

  [`on${CourseNameUpdated.name}`](context: CourseNameUpdated): void {
    this._name = new CourseName(context.name);
  }

  [`on${CourseDescriptionUpdated.name}`](
    context: CourseDescriptionUpdated,
  ): void {
    this._description = new CourseDescription(context.description);
  }

  [`on${CourseLevelUpdated.name}`](context: CourseLevelUpdated): void {
    this._level = new CourseLevel(context.level);
  }

  [`on${CourseTagsUpdated.name}`](context: CourseTagsUpdated): void {
    this._tags = context.tags.map((tag) => new CourseTag(tag));
  }

  [`on${CourseImageUpdated.name}`](context: CourseImageUpdated): void {
    this._image = new CourseImage(context.image);
  }

  [`on${CourseCategoryUpdated.name}`](context: CourseCategoryUpdated): void {
    this._category = new CategoryId(context.category);
  }

  [`on${CourseDurationUpdated.name}`](context: CourseDurationUpdated): void {
    this._duration = new CourseDuration(context.weeks, context.minutes);
  }

  [`on${CourseStarted.name}`](context: CourseStarted) {
    const progress = this.lessons.map((lesson) =>
      UserProgress.start(new UserId(context.user), lesson.id),
    );
    progress.forEach((lessonProgress) =>
      this._progressHistory.push(lessonProgress),
    );
  }

  [`on${CourseLessonWatched.name}`](context: CourseLessonWatched) {
    const user = new UserId(context.user);
    const previouslyCompleted = this.isCompletedBy(user);
    const lessonProgress = this._progressHistory.find(
      (progress) =>
        progress.user.equals(user) &&
        progress.lesson.equals(new LessonId(context.lesson)),
    );
    lessonProgress.lastSecondWatched = new LastSecondWatched(
      context.lastSecondWatched,
    );
    lessonProgress.completionPercentage = new CompletionPercentage(
      context.completionPercentage,
    );
    if (
      !previouslyCompleted &&
      lessonProgress.isCompleted &&
      this.isCompletedBy(user)
    )
      this.apply(CourseCompleted.createEvent(this.id, user));
  }

  [`on${CourseCompleted.name}`](context: CourseCompleted) {}
}
