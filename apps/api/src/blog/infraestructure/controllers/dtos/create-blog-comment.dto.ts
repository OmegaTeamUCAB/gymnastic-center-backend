import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentaryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public userId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public blogId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public content: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public postedAt: Date;
}