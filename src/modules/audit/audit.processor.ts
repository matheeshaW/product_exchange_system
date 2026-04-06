import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit.entity';

@Processor('audit-queue')
export class AuditProcessor extends WorkerHost {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {
    super();
  }

  async process(job: Job<any>) {
    const data = job.data;

    const log = this.auditRepo.create({
      entityType: data.entityType,
      entityId: data.entityId,
      action: data.action,
      userId: data.userId,
    });

    await this.auditRepo.save(log);
  }
}