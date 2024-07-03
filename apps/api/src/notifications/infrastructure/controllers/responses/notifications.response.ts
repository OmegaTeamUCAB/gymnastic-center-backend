import { ApiProperty } from '@nestjs/swagger';

export class OneNotificationResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty({
    type: Date,
  })
  date: Date;
}

export class ManyNotificationsResponse extends OneNotificationResponse {
  @ApiProperty()
  readed: boolean;
}
