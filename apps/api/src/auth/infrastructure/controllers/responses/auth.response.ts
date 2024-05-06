import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from 'apps/api/src/user/infrastructure/controllers/responses';

export class authResponse {
  @ApiProperty()
  token: string;

  @ApiProperty({
    type: () => UserResponse
  })
  user: UserResponse;
}
