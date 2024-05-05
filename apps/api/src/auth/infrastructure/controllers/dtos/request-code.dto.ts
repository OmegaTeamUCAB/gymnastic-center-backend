import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestVerificationCodeDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
