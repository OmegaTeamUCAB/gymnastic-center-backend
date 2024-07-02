import { Entity } from '@app/core';
import {
  CompletionPercentage,
  LastSecondWatched,
  UserProgressId,
} from './value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';
import { LessonId } from '../lessons/value-objects';

export class UserProgress extends Entity<UserProgressId> {
  constructor(
    private readonly _user: UserId,
    private readonly _lesson: LessonId,
    private _completionPercentage: CompletionPercentage,
    private _lastSecondWatched: LastSecondWatched,
  ) {
    super(new UserProgressId(`${_user.value}:${_lesson.value}`));
  }

  get user(): UserId {
    return this._user;
  }

  get lesson(): LessonId {
    return this._lesson;
  }

  get completionPercentage(): CompletionPercentage {
    return this._completionPercentage;
  }

  get lastSecondWatched(): LastSecondWatched {
    return this._lastSecondWatched;
  }

  get isCompleted(): boolean {
    return this._completionPercentage.equals(CompletionPercentage.completed());
  }

  set completionPercentage(completionPercentage: CompletionPercentage) {
    this._completionPercentage = completionPercentage;
  }

  set lastSecondWatched(lastSecondWatched: LastSecondWatched) {
    this._lastSecondWatched = lastSecondWatched;
  }

  completeLesson(): void {
    this._completionPercentage = CompletionPercentage.completed();
  }

  static start(user: UserId, lesson: LessonId): UserProgress {
    return new UserProgress(
      user,
      lesson,
      CompletionPercentage.initial(),
      LastSecondWatched.initial(),
    );
  }
}
