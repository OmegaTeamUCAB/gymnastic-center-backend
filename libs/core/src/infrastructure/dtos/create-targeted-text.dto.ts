import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTargetedTextDto {
  @ApiProperty({
    description: 'Content of the text',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    description: 'The target of the text (UUID)',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  target: string;

  @ApiProperty({
    description: 'Target type (BLOG or LESSON)',
    type: String,
    enum: ['BLOG', 'LESSON'],
  })
  @IsString()
  @IsNotEmpty()
  targetType: 'BLOG' | 'LESSON';
}
