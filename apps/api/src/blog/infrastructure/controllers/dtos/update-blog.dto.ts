import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateBlogDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty()
  images?: string[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  content?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty()
  tags?: string[];

  @IsString()
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  categoryId?: string;
}
