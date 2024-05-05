import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBlogCommentDto {
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