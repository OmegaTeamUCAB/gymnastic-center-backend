import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsInt()
  @Min(1)
  @ApiProperty()
  level: number;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty()
  tags: string[];

  @IsInt()
  @Min(1)
  @ApiProperty()
  weeks: number;

  @IsInt()
  @Min(1)
  @ApiProperty()
  minutes: number;

  @IsUrl()
  @ApiProperty()
  image: string;

  @IsString()
  @IsUUID()
  @ApiProperty()
  categoryId: string;

  @IsString()
  @IsUUID()
  @ApiProperty()
  instructorId: string;

  @ApiProperty({
    type: () => [CreateLessonDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateLessonDto)
  lessons: CreateLessonDto[];
}

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty()
  video: string;
}
