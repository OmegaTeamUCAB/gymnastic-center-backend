import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Gender, Stat } from "../../../domain/entities"
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto{

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    fullName: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    email: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    phoneNumber: string

    @IsDateString()
    @IsOptional()
    @ApiProperty()
    birthDate: Date

    @IsString()
    @IsOptional()
    @ApiProperty()
    gender: Gender

    @IsArray()
    @IsOptional()
    @ApiProperty()
    stats: Stat[]
}