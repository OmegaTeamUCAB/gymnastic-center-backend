import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsString()
  @IsUUID()
  categoryId: string;

  @IsString()
  @IsUUID()
  instructorId: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  tags: string[];
}
