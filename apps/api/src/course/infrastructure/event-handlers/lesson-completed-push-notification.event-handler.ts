import { EVENT_STORE, EventStore } from '@app/core';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PushSenderService } from 'apps/api/src/notifications/infrastructure/provider/push-sender.service';
import { UserRepository } from 'apps/api/src/user/application/repositories/user.repository';
import { USER_REPOSITORY } from 'apps/api/src/user/infrastructure/constants';
import { COURSE_REPOSITORY } from '../constants';
import { CourseRepository } from '../../application/repositories/course.repository';
import { CourseLessonWatched } from '../../domain/events';
import { CourseLessonWatchedEvent } from '../../domain/events/course-lesson-watched';

@Injectable()
export class CourseLessonWatchedPushNotificationEventHandler
  implements OnApplicationBootstrap
{
  constructor(
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private pushSender: PushSenderService,
  ) {}

  onApplicationBootstrap() {
    this.eventStore.subscribe(
      CourseLessonWatched.name,
      async (event: CourseLessonWatchedEvent) => {
        const [course, userWhoWatched] = await Promise.all([
          this.courseRepository.findCourseById(event.dispatcherId),
          this.userRepository.findUserById(event.context.user),
        ]);
        if (!course.hasValue || !userWhoWatched.hasValue) return;
        this.pushSender.sendPushNotification({
          user: userWhoWatched.unwrap().id,
          title: 'Lección completada',
          body: `Muy bien ${userWhoWatched.unwrap().name}, lección completada!`,
        });
      },
    );
  }
}
