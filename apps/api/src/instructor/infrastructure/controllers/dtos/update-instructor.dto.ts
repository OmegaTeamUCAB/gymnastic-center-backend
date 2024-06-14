import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateInstructorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ nullable: true })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ nullable: true })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ nullable: true })
  country: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ nullable: true })
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ nullable: true })
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ nullable: true })
  followers: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ nullable: true })
  userFollow: boolean;
}
