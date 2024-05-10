import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CheckCodeDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @Length(4)
  @ApiProperty({
    description: '4 digit verification code',
  })
  code: string;
}
