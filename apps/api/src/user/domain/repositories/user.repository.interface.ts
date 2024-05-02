import { User } from "../entities";

export interface UserRepository {
    
    findAllUsers(): Promise<User[]>;
    findUserById(id: string): Promise<User>;
    createUser(user: User): Promise<void>;
    updateUserById(user: User): Promise<void>;

}