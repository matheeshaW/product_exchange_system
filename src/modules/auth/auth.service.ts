import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(dto: RegisterDto) {
    try {
      const existingUser = await this.usersService.findByEmail(dto.email);

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 12);

      const user = await this.usersService.createUser(
        dto.email,
        hashedPassword,
      );

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Registration failed');
    }
  }
}