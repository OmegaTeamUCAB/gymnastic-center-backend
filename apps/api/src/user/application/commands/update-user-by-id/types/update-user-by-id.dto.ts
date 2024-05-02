import { Gender, Stat } from "apps/api/src/user/domain/entities"

export type UpdateUserDto = {
    id: string
    name?: string,
    lastName?: string,
    email?: string,
    password?: string,
    birthDate?: Date,
    gender?: Gender,
    stats?: Stat[]
}