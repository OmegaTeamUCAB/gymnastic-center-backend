import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The content of the answer',
    example: 'The answer to the question',
  })
  content: string;

  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'The question id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  question: string;

  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'The user id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  instructor: string;

  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'The lesson id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  course: string;
}