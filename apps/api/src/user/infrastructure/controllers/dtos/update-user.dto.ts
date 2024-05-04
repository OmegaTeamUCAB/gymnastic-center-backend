import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsDateString, IsNotEmpty, IsString } from "class-validator"
import { Gender, Stat } from "../../../domain/entities"

export class UpdateUserDto{

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        nullable: true
    })
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        nullable: true
    })
    lastName: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        nullable: true
    })
    email: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        nullable: true
    })
    phoneNumber: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        nullable: true
    })
    password: string

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({
        nullable: true
    })
    birthDate: Date

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        nullable: true
    })
    gender: Gender

    @IsArray()
    @ApiProperty({
        nullable: true
    })
    stats: Stat[]
}