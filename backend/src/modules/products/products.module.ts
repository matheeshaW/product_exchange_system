import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), RedisModule],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
