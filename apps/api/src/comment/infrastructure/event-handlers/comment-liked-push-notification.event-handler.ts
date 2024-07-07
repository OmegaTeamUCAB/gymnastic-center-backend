import { EVENT_STORE, EventStore } from '@app/core';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PushSenderService } from 'apps/api/src/notifications/infrastructure/provider/push-sender.service';
import { CommentLiked, CommentLikedEvent } from '../../domain/events';
import { CommentRepository } from '../../application/repositories/comment.repository';
import { UserRepository } from 'apps/api/src/user/application/repositories/user.repository';
import { COMMENT_REPOSITORY } from '../constants';
import { USER_REPOSITORY } from 'apps/api/src/user/infrastructure/constants';

@Injectable()
export class CommentLikedPushNotificationEventHandler
  implements OnApplicationBootstrap
{
  constructor(
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private pushSender: PushSenderService,
  ) {}

  onApplicationBootstrap() {
    this.eventStore.subscribe(
      CommentLiked.name,
      async (event: CommentLikedEvent) => {
        const [comment, userWhoLiked] = await Promise.all([
          this.commentRepository.findCommentById(event.dispatcherId),
          this.userRepository.findUserById(event.context.user),
        ]);
        if (
          !comment.hasValue ||
          !userWhoLiked.hasValue ||
          comment.unwrap().publisher.id === userWhoLiked.unwrap().id
        )
          return;
        this.pushSender.sendPushNotification({
          user: comment.unwrap().publisher.id,
          title: 'Nuevo like en tu comentario',
          body: `${userWhoLiked.unwrap().name} le dió like a tu comentario`,
        });
      },
    );
  }
}
