import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '../../modules/users/entities/user.entity';

export class RolesGuard implements CanActivate {
  constructor(private readonly role: UserRole) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const currentRole = String(user?.role ?? '').toUpperCase();
    const requiredRole = String(this.role).toUpperCase();

    if (!user || currentRole !== requiredRole) {
      throw new ForbiddenException('Admin access only');
    }

    return true;
  }
}