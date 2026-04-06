import { Module } from '@nestjs/common';
import { SwapsService } from './swaps.service';
import { SwapsController } from './swaps.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swap } from './entities/swap.entity';
import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Swap, Item, User]),
    AuditModule],
  providers: [SwapsService],
  controllers: [SwapsController]
})
export class SwapsModule { }
