import { ApplicationService, Result } from "@app/core";
import { UpdateUserDto, UpdateUserResponse } from "./types";
import { UserRepository } from "../../../domain/repositories";
import { UserNotFoundException } from "../../exceptions/user-not-found";

export class UpdateUserCommand implements ApplicationService<UpdateUserDto, UpdateUserResponse> {
    constructor(private readonly userRepository: UserRepository) {}

    async execute( data: UpdateUserDto): Promise<Result<UpdateUserResponse>>{
        const user = await this.userRepository.findUserById(data.id);
        if (!user)
            return Result.failure<UpdateUserResponse>(new UserNotFoundException);
        
        if(data.name)
            user.setName(data.name);
        if(data.lastName)
            user.setLastName(data.lastName);
        if(data.email)
            user.setEmail(data.email);
        if(data.password)
            user.setPassword(data.password);
        if(data.birthDate)
            user.setBirthDate(data.birthDate);
        if(data.stats)
            user.setStats(data.stats);

        await this.userRepository.createUser(user);
        return Result.success<UpdateUserResponse>({
            id: user.getId()
        })
    }
}