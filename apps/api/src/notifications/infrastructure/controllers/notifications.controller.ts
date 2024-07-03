import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';
import { Auth, CurrentUser } from 'apps/api/src/auth/infrastructure/decorators';
import {
  ManyNotificationsResponse,
  OneNotificationResponse,
} from './responses';
import { CountResponse, ILogger, LOGGER, LoggingDecorator } from '@app/core';
import { GetUserNotificationsQuery, NotReadCountQuery } from '../queries';
import { NOTIFICATION_REPOSITORY } from '../constants';
import {
  DeleteAllNotificationsCommandHandler,
  LinkDeviceCommandHandler,
  MarkReadCommandHandler,
  UnlinkDeviceCommandHandler,
} from '../../application/commands';
import { AUTH_REPOSITORY } from 'apps/api/src/auth/infrastructure/constants';
import { CredentialsRepository } from 'apps/api/src/auth/application';
import { LinkDeviceDto } from './dtos/link-device.dto';
import { NotificationsRepository } from '../../application/repositories/notifications.repository';

@Controller('notifications')
@ApiTags('Notifications')
@Auth()
export class NotificationsController {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly credentialsRepository: CredentialsRepository,
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationsRepository: NotificationsRepository,
    @Inject(LOGGER)
    private readonly logger: ILogger,
    private readonly getUserNotificationsQuery: GetUserNotificationsQuery,
    private readonly notReadCountQuery: NotReadCountQuery,
  ) {}

  @Get('many')
  @ApiQuery({
    name: 'perPage',
    required: false,
    description:
      'Number of results to return for each type of search. DEFAULT = 8',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Number of page. DEFAULT = 1',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    type: [ManyNotificationsResponse],
    description: 'Notifications list',
  })
  async getNotifications(
    @CurrentUser() credentials: Credentials,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ): Promise<ManyNotificationsResponse[]> {
    return this.getUserNotificationsQuery.execute({
      userId: credentials.userId,
      page,
      perPage,
    });
  }

  @Get('count/not-readed')
  @ApiResponse({
    status: 200,
    type: CountResponse,
    description: 'Notifications count',
  })
  async getNotificationsCount(
    @CurrentUser() credentials: Credentials,
  ): Promise<CountResponse> {
    const count = await this.notReadCountQuery.execute({
      userId: credentials.userId,
    });
    return { count };
  }

  @Get('one/:id')
  @ApiResponse({
    status: 200,
    type: OneNotificationResponse,
    description: 'Notifications list',
  })
  async getNotification(
    @Param('id') id: string,
  ): Promise<OneNotificationResponse> {
    const notification = await this.notificationsRepository.getNotification(id);
    if (notification.hasValue) {
      if (!notification.unwrap().read) {
        const service = new LoggingDecorator(
          new MarkReadCommandHandler(this.notificationsRepository),
          this.logger,
          'Read Notification',
        );
        service.execute({
          notificationId: id,
        });
      }
      return notification.unwrap();
    }
    throw new NotFoundException('Notification not found');
  }

  @Post('savetoken')
  async saveToken(
    @CurrentUser() credentials: Credentials,
    @Body() linkDeviceDto: LinkDeviceDto,
  ) {
    const service = new LinkDeviceCommandHandler(this.credentialsRepository);
    await service.execute({
      deviceId: linkDeviceDto.token,
      userId: credentials.userId,
    });
  }

  @Post('removetoken')
  async removeToken(
    @CurrentUser() credentials: Credentials,
    @Body() linkDeviceDto: LinkDeviceDto,
  ) {
    const service = new UnlinkDeviceCommandHandler(this.credentialsRepository);
    await service.execute({
      deviceId: linkDeviceDto.token,
      userId: credentials.userId,
    });
  }

  @Post('delete/all')
  async deleteAll(@CurrentUser() credentials: Credentials) {
    const service = new LoggingDecorator(
      new DeleteAllNotificationsCommandHandler(this.notificationsRepository),
      this.logger,
      'Delete Notifications',
    );
    await service.execute({
      userId: credentials.userId,
    });
  }
}
