import { ApiProperty } from '@nestjs/swagger';

export class BLogCommentResponse {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    blogId: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    postedAt: Date;
}