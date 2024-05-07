import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateBlogDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public imageUrl: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public description: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public content: string;

    @IsArray()
    @IsOptional()
    public tags: string[];
}