import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { CredentialsRepository } from 'apps/api/src/auth/application';
import { AUTH_REPOSITORY } from 'apps/api/src/auth/infrastructure/constants';
import { Notification } from '../../application/models/notification';
import { MongoNotification } from '../models/mongo-notification.model';
import { IdGenerator, Result, UUIDGENERATOR } from '@app/core';

@Injectable()
export class PushSenderService {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    @Inject(AUTH_REPOSITORY)
    private readonly credentialsRepository: CredentialsRepository,
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @InjectModel(MongoNotification.name)
    private readonly notificationModel: Model<MongoNotification>,
  ) {}

  async sendPushNotification(
    data: Omit<Notification, 'id' | 'date' | 'read'>,
  ): Promise<Result<void>> {
    const user = await this.credentialsRepository.findCredentialsByUserId(
      data.user,
    );
    if (!user.hasValue) return Result.failure(new Error('User not found'));
    const devices = user.unwrap().devices;
    if (devices.length === 0) return Result.success(null);
    await Promise.all([
      this.notificationModel.create({
        ...data,
        id: this.uuidGenerator.generateId(),
        date: new Date(),
        read: false,
      }),
      this.firebase.messaging.sendEachForMulticast({
        tokens: devices,
        notification: {
          title: data.title,
          body: data.body,
        },
      }),
    ]);
    return Result.success(null);
  }
}
