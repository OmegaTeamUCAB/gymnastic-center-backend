import { ApiProperty } from "@nestjs/swagger";

export class BlogResponse {
    @ApiProperty()
    id: string;

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
}