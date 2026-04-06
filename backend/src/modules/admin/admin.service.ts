import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getUsers() {
        return this.userRepository.find({
            where: { deletedAt: IsNull() },
            order: { createdAt: 'DESC' },
        });
    }
    async deleteUser(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId, deletedAt: IsNull() },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        await this.userRepository.softDelete(userId);

        return {
            success: true,
            message: 'User deleted successfully',
        };
    }
}
