import { Injectable,
  InternalServerErrorException
 } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

 async findByEmail(email: string): Promise<User | null> {
  try {
    return await this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });
  } catch (error) {
    throw new InternalServerErrorException('Failed to fetch user');
  }
}

  async createUser(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }
}