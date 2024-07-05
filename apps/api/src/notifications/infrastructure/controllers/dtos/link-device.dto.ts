import { IsNotEmpty, IsString } from 'class-validator';

export class LinkDeviceDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
