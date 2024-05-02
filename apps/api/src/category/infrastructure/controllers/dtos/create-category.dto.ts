import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsUrl()
  @ApiProperty({
    description: 'Category icon url',
    example: 'https://example.com/icon.png',
  })
  icon: string;
}
