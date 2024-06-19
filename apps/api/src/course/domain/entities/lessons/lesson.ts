import { Entity } from '@app/core';
import {
  LessonDescription,
  LessonId,
  LessonTitle,
  LessonVideo,
} from './value-objects';

export class Lesson extends Entity<LessonId> {
  constructor(
    id: LessonId,
    protected _title: LessonTitle,
    protected _description: LessonDescription,
    protected _video: LessonVideo,
  ) {
    super(id);
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get video() {
    return this._video;
  }

  set title(title: LessonTitle) {
    this._title = title;
  }

  set description(description: LessonDescription) {
    this._description = description;
  }

  set video(video: LessonVideo) {
    this._video = video;
  }
}
