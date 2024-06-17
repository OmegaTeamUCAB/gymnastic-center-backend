import { Lesson } from './lessons/lesson';
import { InvalidCourseException } from './exceptions';
import {
  CourseDescription,
  CourseId,
  CourseImage,
  CourseLevel,
  CourseMinute,
  CourseName,
  CourseTag,
  CourseWeek,
} from './value-objects';
import { CategoryId } from '../../category/domain/value-objects/category-id';
import { InstructorId } from '../../instructor/domain/value-objects/instructor-id';
import { AggregateRoot, DomainEvent } from '@app/core';
import {
  CourseCategoryUpdated,
  CourseDescriptionUpdated,
  CourseImageUpdated,
  CourseInstructorUpdated,
  CourseLevelUpdated,
  CourseMinutesUpdated,
  CourseNameUpdated,
  CourseTagsUpdated,
  CourseWeeksUpdated,
} from './events';
import { CourseCreated } from './events/course-created';

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
      !this._weeks ||
      !this._minutes ||
      !this._image ||
      this._image.value.length === 0 ||
      !this._categoryId ||
      !this._instructorId
    ) {
      throw new InvalidCourseException();
    }
  }

  private _name: CourseName;
  private _description: CourseDescription;
  private _level: CourseLevel;
  private _tags: CourseTag[];
  private _weeks: CourseWeek;
  private _minutes: CourseMinute;
  private _image: CourseImage;
  private _categoryId: CategoryId;
  private _instructorId: InstructorId;
  // private _lessons: Lesson[]

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

  get weeks(): CourseWeek {
    return this._weeks;
  }

  get minutes(): CourseMinute {
    return this._minutes;
  }

  get images(): CourseImage {
    return this._image;
  }

  get categoryId(): CategoryId {
    return this._categoryId;
  }

  get instructorId(): InstructorId {
    return this._instructorId;
  }

  // get lessons(): Lesson[] {
  //   return this._lessons;
  // }

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

  updateWeeks(weeks: CourseWeek): void {
    this.apply(CourseWeeksUpdated.createEvent(this.id, weeks));
  }

  updateMinutes(minutes: CourseMinute): void {
    this.apply(CourseMinutesUpdated.createEvent(this.id, minutes));
  }

  updateImages(image: CourseImage): void {
    this.apply(CourseImageUpdated.createEvent(this.id, image));
  }

  updateCategory(categoryId: CategoryId): void {
    this.apply(CourseCategoryUpdated.createEvent(this.id, categoryId));
  }

  updateInstructor(instructorId: InstructorId): void {
    this.apply(CourseInstructorUpdated.createEvent(this.id, instructorId));
  }

  // updateLessons(lesson: Lesson): void {
  //   this.apply(LessonAdded.createEvent(this.id, lesson));
  // }

  static create(
    id: CourseId,
    data: {
      name: CourseName;
      description: CourseDescription;
      level: CourseLevel;
      tags: CourseTag[];
      weeks: CourseWeek;
      minutes: CourseMinute;
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
        data.weeks,
        data.minutes,
        data.image,
        data.category,
        data.instructor,
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
    this._weeks = new CourseWeek(context.weeks);
    this._minutes = new CourseMinute(context.minutes);
    this._image =  new CourseImage(context.image);
    this._categoryId = new CategoryId(context.category);
    this._instructorId = new InstructorId(context.instructor);
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

  [`on${CourseWeeksUpdated.name}`](context: CourseWeeksUpdated): void {
    this._weeks = new CourseWeek(context.weeks);
  }

  [`on${CourseMinutesUpdated.name}`](context: CourseMinutesUpdated): void {
    this._minutes = new CourseMinute(context.minutes);
  }

  [`on${CourseImageUpdated.name}`](context: CourseImageUpdated): void {
    this._image = new CourseImage(context.image);
  }

  [`on${CourseCategoryUpdated.name}`](context: CourseCategoryUpdated): void {
    this._categoryId = new CategoryId(context.category);
  }

  [`on${CourseInstructorUpdated.name}`](
    context: CourseInstructorUpdated,
  ): void {
    this._instructorId = new InstructorId(context.instructor);
  }
}
