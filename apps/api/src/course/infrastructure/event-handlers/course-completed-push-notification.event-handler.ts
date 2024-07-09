import { EVENT_STORE, EventStore } from '@app/core';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PushSenderService } from 'apps/api/src/notifications/infrastructure/provider/push-sender.service';
import { UserRepository } from 'apps/api/src/user/application/repositories/user.repository';
import { USER_REPOSITORY } from 'apps/api/src/user/infrastructure/constants';
import {
  CourseCompleted,
  CourseCompletedEvent,
} from '../../domain/events/course-completed';
import { COURSE_REPOSITORY } from '../constants';
import { CourseRepository } from '../../application/repositories/course.repository';

@Injectable()
export class CourseCompletedPushNotificationEventHandler
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
      CourseCompleted.name,
      async (event: CourseCompletedEvent) => {
        const [course, userWhoCompleted] = await Promise.all([
          this.courseRepository.findCourseById(event.dispatcherId),
          this.userRepository.findUserById(event.context.user),
        ]);
        if (!course.hasValue || !userWhoCompleted.hasValue) return;
        this.pushSender.sendPushNotification({
          user: userWhoCompleted.unwrap().id,
          title: 'Curso completado',
          body: `¡Felicidades ${userWhoCompleted.unwrap().name} completaste el curso ${course.unwrap().title}!`,
        });
      },
    );
  }
}
