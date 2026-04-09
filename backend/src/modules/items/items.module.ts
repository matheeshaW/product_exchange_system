import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { User } from '../users/entities/user.entity';
import { RedisModule } from 'src/common/redis/redis.module';
import { ItemImagesModule } from '../item-images/item-images.module';
import { StorageModule } from 'src/common/storage/storage.module';
import { AuditModule } from '../audit/audit.module';
import { ItemImage } from '../item-images/entities/item-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, User, ItemImage]),
    RedisModule,
    StorageModule,
    ItemImagesModule,
    AuditModule],
  providers: [ItemsService],
  controllers: [ItemsController]
})
export class ItemsModule { }
