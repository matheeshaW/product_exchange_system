import { Module } from '@nestjs/common';
import { ItemImagesService } from './item-images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemImage } from './entities/item-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemImage])],
  providers: [ItemImagesService],
  exports: [ItemImagesService],
})
export class ItemImagesModule {}
