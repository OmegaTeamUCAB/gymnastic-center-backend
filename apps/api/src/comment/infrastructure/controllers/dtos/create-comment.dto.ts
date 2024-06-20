import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    content: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    blog: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    publisher: string;
}