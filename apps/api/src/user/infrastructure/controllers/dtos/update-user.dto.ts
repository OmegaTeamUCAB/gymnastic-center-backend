import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsOptional, IsString } from 'class-validator';

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

  @IsBase64()
  @IsOptional()
  @ApiProperty({
    nullable: true,
    type: 'string',
    format: 'base64',
  })
  image: string;
}
