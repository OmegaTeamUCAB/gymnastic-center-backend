import { ApiProperty } from '@nestjs/swagger';
import { BLogCommentResponse } from './blog-comment.response';

export class BlogResponse {
    @ApiProperty()
    id: string;

    @ApiProperty({ type: [BLogCommentResponse] })
    comments: BLogCommentResponse[];

    @ApiProperty()
    imageUrl: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    uploadDate: Date;

    @ApiProperty()
    tags: string[];
}