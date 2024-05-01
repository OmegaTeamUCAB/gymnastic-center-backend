import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    nullable: true,
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Category icon url',
    example: 'https://example.com/icon.png',
    nullable: true,
  })
  icon: string;
}
