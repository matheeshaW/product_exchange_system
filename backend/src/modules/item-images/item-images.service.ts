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

  async getImagesByItemId(itemId: string) {
    return this.repo.find({
      where: { itemId },
      order: { createdAt: 'ASC' },
    });
  }

  async deleteByItemIdAndUrls(itemId: string, imageUrls: string[]) {
    if (imageUrls.length === 0) {
      return;
    }

    await this.repo
      .createQueryBuilder()
      .delete()
      .from(ItemImage)
      .where('item_id = :itemId', { itemId })
      .andWhere('image_url IN (:...imageUrls)', { imageUrls })
      .execute();
  }
}