import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AuditModule } from './modules/audit/audit.module';
import { ItemsModule } from './modules/items/items.module';
import { ItemImagesModule } from './modules/item-images/item-images.module';
import { SwapsModule } from './modules/swaps/swaps.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true, // ✅ dev only
    }),

    BullModule.forRoot({
      connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  }),

    AuthModule,

    UsersModule,

    ProductsModule,

    AuditModule,

    ItemsModule,

    ItemImagesModule,

    SwapsModule
  ],
})
export class AppModule {}
