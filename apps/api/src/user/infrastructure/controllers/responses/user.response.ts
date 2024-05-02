import { ApiProperty } from "@nestjs/swagger"
import { Gender, Stat } from "../../../domain/entities"

export class UserResponse{
    @ApiProperty()
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    lastName: string

    @ApiProperty()
    email: string

    @ApiProperty()
    password: string

    @ApiProperty()
    birthDate: Date

    @ApiProperty()
    gender: Gender

    @ApiProperty()
    stats: Stat[]
}