import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';


@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 12);

      const user = await this.usersService.registerOrRestoreUser(
        dto.email,
        hashedPassword,
        dto.name,
        dto.phone,
        dto.province,
        dto.district,
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

  async login(dto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(dto.email);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(
        dto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      return {
        accessToken,
        refreshToken,
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException('Login failed');
    }
  }



  async refresh(token: string) {
    try {
      const decoded = this.jwtService.verify(token);

      const payload = {
        sub: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });

      return {
        success: true,
        data: { accessToken },
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }


}