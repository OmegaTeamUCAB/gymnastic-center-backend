import { Gender } from "../../domain/entities/instructor.entity";
import { ApiProperty } from "@nestjs/swagger";

export class InstructorResponse {

    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    birthDate: Date;

    @ApiProperty()
    email: string;

    @ApiProperty({ enum: ['male', 'female'] })
    gender: Gender;
}