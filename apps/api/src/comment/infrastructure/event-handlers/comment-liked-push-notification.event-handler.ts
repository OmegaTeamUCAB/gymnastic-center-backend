import { EVENT_STORE, EventStore, MongoUser } from '@app/core';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PushSenderService } from 'apps/api/src/notifications/infrastructure/provider/push-sender.service';
import { CommentLiked, CommentLikedEvent } from '../../domain/events';
import { CommentRepository } from '../../application/repositories/comment.repository';
import { MongoCommentRepository } from '../repositories/mongo-comment.repository';

@Injectable()
export class CommentLikedPushNotificationEventHandler
  implements OnApplicationBootstrap
{
  constructor(
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    private pushSender: PushSenderService,
    @Inject(MongoCommentRepository)
    private readonly commentRepository: CommentRepository,
    @InjectModel(MongoUser.name)
    private readonly userModel: Model<MongoUser>,
  ) {}

  onApplicationBootstrap() {
    this.eventStore.subscribe(
      CommentLiked.name,
      async (event: CommentLikedEvent) => {
        const [comment, userWhoLiked] = await Promise.all([
          this.commentRepository.findCommentById(event.dispatcherId),
          this.userModel.findOne({ id: event.context.user }),
        ]);
        if (
          !comment.hasValue ||
          !userWhoLiked ||
          comment.unwrap().publisher.id === userWhoLiked.id
        )
          return;
        this.pushSender.sendPushNotification({
          user: comment.unwrap().publisher.id,
          title: 'Nuevo like en tu comentario',
          body: `${userWhoLiked.name} le dió like a tu comentario`,
        });
      },
    );
  }
}
