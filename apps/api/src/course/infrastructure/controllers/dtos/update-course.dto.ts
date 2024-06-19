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

export class DurationDto {
  @IsInt()
  @Min(1)
  @ApiProperty()
  weeks?: number;

  @IsInt()
  @Min(1)
  @ApiProperty()
  minutes?: number;
}

export class UpdateCourseDto {
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

  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty()
  level?: number;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  @ApiProperty()
  tags?: string[];

  @ApiProperty({
    type: () => DurationDto,
  })
  @ValidateNested()
  @Type(() => DurationDto)
  @IsOptional()
  duration?: DurationDto;

  @IsUrl()
  @IsOptional()
  @ApiProperty()
  imageUrl?: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  categoryId?: string;
}
