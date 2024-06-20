import { ApiProperty } from "@nestjs/swagger";

export class CommentResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    user: string;

    @ApiProperty()
    countLikes?: number;

    @ApiProperty()
    countDislikes?: number;
    
    @ApiProperty()
    body: string;

    @ApiProperty()
    date: Date;

}