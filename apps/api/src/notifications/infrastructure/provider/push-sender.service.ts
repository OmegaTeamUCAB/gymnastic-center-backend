import { Inject, Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { CredentialsRepository } from 'apps/api/src/auth/application';
import { AUTH_REPOSITORY } from 'apps/api/src/auth/infrastructure/constants';
import { Notification } from '../../application/models/notification';
import { IdGenerator, Result, UUIDGENERATOR } from '@app/core';
import { NOTIFICATION_REPOSITORY } from '../constants';
import { NotificationRepository } from '../../application/repositories/notification.repository';

@Injectable()
export class PushSenderService {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    @Inject(AUTH_REPOSITORY)
    private readonly credentialsRepository: CredentialsRepository,
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
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
      this.notificationRepository.saveNotification({
        id: this.uuidGenerator.generateId(),
        body: data.body,
        read: false,
        title: data.title,
        user: data.user,
        date: new Date(),
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
