import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public imageUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public content: string;

  @IsNotEmpty()
  @ApiProperty()
  public uploadDate: Date;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  public tags: string[];
}
