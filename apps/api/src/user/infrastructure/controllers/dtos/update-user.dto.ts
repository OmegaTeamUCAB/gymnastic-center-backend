import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBase64,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    nullable: true,
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    nullable: true,
  })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    nullable: true,
  })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    nullable: true,
  })
  password: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    nullable: true,
  })
  birthDate: Date;

  @IsBase64()
  @IsOptional()
  @ApiProperty({
    nullable: true,
    type: 'string',
    format: 'base64',
  })
  image: string;
}
