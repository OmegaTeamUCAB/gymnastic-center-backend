import { ApiProperty } from '@nestjs/swagger';

export class CommentResponse {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    blogId: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    postedAt: Date;
}