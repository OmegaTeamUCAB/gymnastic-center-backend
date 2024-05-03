import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBlogDto {
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    imageUrl: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    content: string;
    
    @IsNotEmpty()
    @ApiProperty()
    uploadDate: Date;
}