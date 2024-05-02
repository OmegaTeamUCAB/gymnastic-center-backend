import { User } from "apps/api/src/user/domain/entities";

export type GetAllUsersResponse = {
    users: User[];
}