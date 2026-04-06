import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit.entity';
import { BullModule } from '@nestjs/bullmq';
import { AuditProcessor } from './audit.processor';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog]), 
  BullModule.registerQueue({
      name: 'audit-queue',
    }),],
  providers: [AuditService, AuditProcessor],
  exports: [AuditService],
})
export class AuditModule {}