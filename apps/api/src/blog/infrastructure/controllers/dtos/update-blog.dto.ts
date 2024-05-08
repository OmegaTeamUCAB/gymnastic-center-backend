import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  content?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
