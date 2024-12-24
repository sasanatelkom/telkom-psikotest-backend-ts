import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';


@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async getUserById(id: string) {
        return await this.userRepository.getThrowUserById(id)
    }
    async getUserByUsername(username: string) {
        return await this.userRepository.getThrowUserByUsername(username)
    }
}