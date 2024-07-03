import {
  Controller,
  DefaultValuePipe,
  Get,
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
import { CountResponse } from '@app/core';
import {
  GetNotificationQuery,
  GetUserNotificationsQuery,
  NotReadCountQuery,
} from '../queries';

@Controller('notifications')
@ApiTags('Notifications')
@Auth()
export class NotificationsController {
  constructor(
    private readonly getNotificationQuery: GetNotificationQuery,
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
    const notification = await this.getNotificationQuery.execute({
      id,
    });
    if (notification.hasValue) return notification.unwrap();
    throw new NotFoundException('Notification not found');
  }

  @Post('savetoken')
  async saveToken() {}

  @Post('delete/all')
  async deleteAll() {}
}
