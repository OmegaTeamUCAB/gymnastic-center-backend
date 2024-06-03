import { ApiProperty } from '@nestjs/swagger';

export class InstructorResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  followers: number;

  @ApiProperty()
  userFollow: boolean;

  @ApiProperty()
  location: string;
}
