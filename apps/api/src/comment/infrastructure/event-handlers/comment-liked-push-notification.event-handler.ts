import { EVENT_STORE, EventStore, MongoComment, MongoUser } from '@app/core';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PushSenderService } from 'apps/api/src/notifications/infrastructure/provider/push-sender.service';
import { CommentLiked, CommentLikedEvent } from '../../domain/events';

@Injectable()
export class CommentLikedPushNotificationEventHandler
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
      CommentLiked.name,
      async (event: CommentLikedEvent) => {
        const [comment, userWhoLiked] = await Promise.all([
          this.commentModel.findOne({ id: event.dispatcherId }),
          this.userModel.findOne({ id: event.context.user }),
        ]);
        if (
          !comment ||
          !userWhoLiked ||
          comment.publisher.id === userWhoLiked.id
        )
          return;
        this.pushSender.sendPushNotification({
          user: comment.publisher.id,
          title: 'Nuevo like en tu comentario',
          body: `${userWhoLiked.name} le dió like a tu comentario`,
        });
      },
    );
  }
}
