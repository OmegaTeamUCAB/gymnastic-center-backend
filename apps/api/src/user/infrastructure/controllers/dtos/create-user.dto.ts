import { IsArray, IsDateString, IsNotEmpty, IsString } from "class-validator"
import { Gender, Stat } from "../../../domain/entities"
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto{

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    email: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    phoneNumber: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    birthDate: Date

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    gender: Gender

    @IsArray()
    @ApiProperty()
    stats: Stat[]
}