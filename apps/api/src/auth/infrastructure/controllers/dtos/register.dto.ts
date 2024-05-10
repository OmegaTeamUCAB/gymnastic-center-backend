import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(3)
  @ApiProperty()
  fullName: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    minLength: 8,
  })
  password: string;

  @IsString()
  @MinLength(10)
  @ApiProperty({
    minLength: 10,
  })
  phoneNumber: string;
}
