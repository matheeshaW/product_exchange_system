import { Module } from '@nestjs/common';
import { SwapsService } from './swaps.service';
import { SwapsController } from './swaps.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swap } from './entities/swap.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Swap])],
  providers: [SwapsService],
  controllers: [SwapsController]
})
export class SwapsModule {}
