import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async getUserById(id: string) {
        return await this.userRepository.getThrowUserById(id);
    }

    async getUserByUsername(username: string) {
        return await this.userRepository.getThrowUserByUsername(username);
    }

    async createUser(dto: CreateUserDto) {
        return await this.userRepository.createUser(dto);
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        return await this.userRepository.updateUser(id, dto);
    }

    async deleteUser(id: string) {
        return await this.userRepository.deleteUser(id);
    }
}
