import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsDateString, IsOptional, IsString } from "class-validator"
import { Gender, Stat } from "../../../domain/entities"

export class UpdateUserDto{

    @IsString()
    @IsOptional()
    @ApiProperty({
        nullable: true
    })
    name: string

    @IsString()
    @IsOptional()
    @ApiProperty({
        nullable: true
    })
    email: string

    @IsString()
    @IsOptional()
    @ApiProperty({
        nullable: true
    })
    phoneNumber: string

    @IsString()
    @IsOptional()
    @ApiProperty({
        nullable: true
    })
    password: string

    @IsDateString()
    @IsOptional()
    @ApiProperty({
        nullable: true
    })
    birthDate: Date

    @IsString()
    @IsOptional()
    @ApiProperty({
        nullable: true
    })
    gender: Gender

    @IsArray()
    @IsOptional()
    @ApiProperty({
        nullable: true
    })
    stats: Stat[]
}