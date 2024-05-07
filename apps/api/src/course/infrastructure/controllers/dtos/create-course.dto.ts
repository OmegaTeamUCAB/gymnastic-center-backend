import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, IsUrl, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

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
  imageUrl: string;

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
  lessons: CreateLessonDto[];
}

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    nullable: true,
  })
  content: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    nullable: true,
  })
  videoUrl: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    nullable: true,
  })
  imageUrl: string;
}
