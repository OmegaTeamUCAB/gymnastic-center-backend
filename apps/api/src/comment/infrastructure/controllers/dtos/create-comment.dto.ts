import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  body: string;

  @IsString()
  @IsUUID()
  @ApiProperty()
  target: string;

  @IsString()
  @IsIn(['LESSON', 'BLOG'])
  @ApiProperty({
    enum: ['LESSON', 'BLOG'],
  })
  targetType: 'LESSON' | 'BLOG';
}
