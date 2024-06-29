import { IsBoolean, IsInt, IsString, IsUUID, Min } from 'class-validator';

export class WatchCourseDto {
  @IsString()
  @IsUUID()
  courseId: string;

  @IsString()
  @IsUUID()
  lessonId: string;

  @IsBoolean()
  markAsCompleted: boolean;

  @IsInt()
  @Min(0)
  time: number;

  @IsInt()
  @Min(0)
  totalTime: number;
}
