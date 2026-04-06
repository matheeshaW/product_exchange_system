import {
  Injectable,
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
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { email, deletedAt: IsNull() },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }


  async createUser(
    email: string,
    password: string,
    name: string,
    phone: string,
    province: string,
    district: string,
  ): Promise<User> {
    try {
      const user = this.userRepository.create({
        email,
        password,
        name,
        phone,
        province,
        district,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}