import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

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
    role: UserRole = UserRole.USER,
  ): Promise<User> {
    try {
      const user = this.userRepository.create({
        email,
        password,
        name,
        role,
        phone,
        province,
        district,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async registerOrRestoreUser(
    email: string,
    hashedPassword: string,
    name: string,
    phone: string,
    province: string,
    district: string,
  ): Promise<User> {
    try {
      // Check if user exists (including soft-deleted)
      const existingUser = await this.userRepository.findOne({
        where: { email },
        withDeleted: true,
      });

      if (existingUser && !existingUser.deletedAt) {
        // Active user with this email already exists
        throw new BadRequestException('Email already in use');
      }

      if (existingUser && existingUser.deletedAt) {
        // Restore soft-deleted user
        existingUser.password = hashedPassword;
        existingUser.name = name;
        existingUser.phone = phone;
        existingUser.province = province;
        existingUser.district = district;
        existingUser.deletedAt = null;

        return await this.userRepository.save(existingUser);
      }

      // Create new user
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        name,
        role: UserRole.USER,
        phone,
        province,
        district,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async getProfile(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, deletedAt: IsNull() },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      return {
        success: true,
        message: 'Profile fetched successfully',
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          phone: user.phone,
          province: user.province,
          district: user.district,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Failed to fetch profile');
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, deletedAt: IsNull() },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (dto.name !== undefined) user.name = dto.name;
      if (dto.phone !== undefined) user.phone = dto.phone;
      if (dto.province !== undefined) user.province = dto.province;
      if (dto.district !== undefined) user.district = dto.district;

      const updated = await this.userRepository.save(user);

      return {
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: updated.id,
          email: updated.email,
          role: updated.role,
          name: updated.name,
          phone: updated.phone,
          province: updated.province,
          district: updated.district,
          updatedAt: updated.updatedAt,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Failed to update profile');
    }
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, deletedAt: IsNull() },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const isCurrentValid = await bcrypt.compare(
        dto.currentPassword,
        user.password,
      );

      if (!isCurrentValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      if (dto.currentPassword === dto.newPassword) {
        throw new BadRequestException('New password must be different');
      }

      user.password = await bcrypt.hash(dto.newPassword, 12);
      await this.userRepository.save(user);

      return {
        success: true,
        message: 'Password updated successfully',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update password');
    }
  }

  async softDeleteAccount(userId: string, password: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, deletedAt: IsNull() },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Password is incorrect');
      }

      await this.userRepository.softDelete(userId);

      return {
        success: true,
        message: 'Account deleted successfully',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete account');
    }
  }
}