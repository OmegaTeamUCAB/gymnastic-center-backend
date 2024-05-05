import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Min,
} from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  @IsUUID()
  id: string;
  
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty()
  level: number;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  @ApiProperty()
  tags: string[];

  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty()
  weeks: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty()
  minutes: number;

  @IsUrl()
  @IsOptional()
  @ApiProperty()
  imageUrl: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  categoryId: string;
}
