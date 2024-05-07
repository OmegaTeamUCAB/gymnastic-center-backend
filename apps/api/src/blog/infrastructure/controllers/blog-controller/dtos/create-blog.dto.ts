import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { BlogComment } from 'apps/api/src/blog/domain/comment/blog-comment';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
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
    
    @IsNotEmpty()
    @ApiProperty()
    public uploadDate: Date;

    @IsArray()
    @ApiProperty()
    public comments: BlogComment[];

    @IsArray()
    @ApiProperty()
    public tags: string[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    categoryId: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    instructorId: string;
}