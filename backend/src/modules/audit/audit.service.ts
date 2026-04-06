import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AuditService {
  constructor(
    @InjectQueue('audit-queue')
    private readonly auditQueue: Queue,
  ) {}

  async logAction(data: {
    entityType: string;
    entityId: string;
    action: string;
    userId: string;
  }) {
    await this.auditQueue.add('log', data);
  }
}