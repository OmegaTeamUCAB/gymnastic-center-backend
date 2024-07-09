import { EVENT_STORE, EventStore, MongoComment, MongoUser } from '@app/core';
import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PushSenderService } from 'apps/api/src/notifications/infrastructure/provider/push-sender.service';
import { CommentDisliked, CommentDislikedEvent } from '../../domain/events';

export class CommentDislikedPushNotificationEventHandler
  implements OnApplicationBootstrap
{
  constructor(
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    private pushSender: PushSenderService,
    @InjectModel(MongoComment.name)
    private readonly commentModel: Model<MongoComment>,
    @InjectModel(MongoUser.name)
    private readonly userModel: Model<MongoUser>,
  ) {}

  onApplicationBootstrap() {
    this.eventStore.subscribe(
      CommentDisliked.name,
      async (event: CommentDislikedEvent) => {
        const [comment, userWhoDisliked] = await Promise.all([
          this.commentModel.findOne({ id: event.dispatcherId }),
          this.userModel.findOne({ id: event.context.user }),
        ]);
        if (
          !comment ||
          !userWhoDisliked ||
          comment.publisher.id === userWhoDisliked.id
        )
          return;
        this.pushSender.sendPushNotification({
          user: comment.publisher.id,
          title: 'Nuevo dislike en tu comentario',
          body: `${userWhoDisliked.name} le dió dislike a tu comentario`,
        });
      },
    );
  }
}
