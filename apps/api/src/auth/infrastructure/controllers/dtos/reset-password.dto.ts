import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
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
  @Length(4)
  @ApiProperty({
    description: '4 digit verification code',
  })
  code: string;
}
