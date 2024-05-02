import { ApplicationService, Result } from "@app/core";
import { GetAllUsersResponse } from "./types";
import { UserRepository } from "../../../domain/repositories";
import { UsersListEmpty } from "../../exceptions/users-list-empty";

export class GetAllUsersQuery implements ApplicationService<void, GetAllUsersResponse> {

    constructor(
        public readonly userRepository: UserRepository,
    ) { }

    async execute(): Promise<Result<GetAllUsersResponse>>{
        
        const users = await this.userRepository.findAllUsers();
        if (users.length === 0) return Result.failure(new UsersListEmpty());
        return Result.success<GetAllUsersResponse>({ users })
        
    }

}