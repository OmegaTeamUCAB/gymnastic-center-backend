import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty()
  images: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty()
  tags: string[];

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  category: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  instructor: string;
}
