import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemImage } from './entities/item-image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemImagesService {
  constructor(
    @InjectRepository(ItemImage)
    private readonly repo: Repository<ItemImage>,
  ) {}

  async saveImages(itemId: string, urls: string[]) {
    const images = urls.map((url) =>
      this.repo.create({ itemId, imageUrl: url }),
    );

    return this.repo.save(images);
  }
}