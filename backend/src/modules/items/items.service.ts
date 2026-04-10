import {
  Injectable,
  InternalServerErrorException,
  Inject,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, IsNull } from 'typeorm';
import { Item } from './entities/item.entity';
import { User } from '../users/entities/user.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { RedisService } from 'src/common/redis/redis.service';
import type { StorageService } from 'src/common/storage/storage.interface';
import { ItemImagesService } from '../item-images/item-images.service';
import { AuditService } from '../audit/audit.service';
import { ItemImage } from '../item-images/entities/item-image.entity';
import { ItemStatus } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,

    @Inject('StorageService')
    private readonly storageService: StorageService,

    private readonly itemImagesService: ItemImagesService,
    private readonly auditService: AuditService,

    @InjectRepository(ItemImage)
    private readonly itemImageRepository: Repository<ItemImage>,
  ) { }

  private async invalidateItemCaches(itemId?: string) {
    await this.redisService.deleteByPrefix('inventory:items:');
    if (itemId) {
      await this.redisService.del(`inventory:item:${itemId}`);
    }
  }

  async createItem(dto: CreateItemDto, userId: string, files: Express.Multer.File[]) {
    try {
      const item = this.itemRepository.create({
        ...dto,
        ownerId: userId,
      });

      const saved = await this.itemRepository.save(item);

      // upload images
      const imageUrls: string[] = [];

      for (const file of files) {
        const url = await this.storageService.upload(file.buffer);
        imageUrls.push(url);
      }

      await this.itemImagesService.saveImages(saved.id, imageUrls);

      await this.invalidateItemCaches(saved.id);
      try { 
      await this.auditService.logAction({
        entityType: 'ITEM',
        entityId: saved.id,
        action: 'CREATED',
        userId: userId,
      });
      } catch (auditError) {
      console.error('Audit enqueuq failt for ITEM create:', auditError);
    }
    return {
      success: true,
      message: 'Item created successfully',
      data: {
        ...saved,
        images: imageUrls,
      },
    };
  } catch(error) {
    throw new InternalServerErrorException('Failed to create item');
  }
}

  async getItems(filters: {
  search?: string;
  category?: string;
  condition?: string;
  district?: string;
  province?: string;
}) {
  try {
    //  dynamic cache key
    const cacheKey = `inventory:items:${JSON.stringify(filters)}`;

    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return {
        success: true,
        message: 'Items fetched from cache',
        data: JSON.parse(cached),
      };
    }

    const query = this.itemRepository
      .createQueryBuilder('item')
      .where('item.deleted_at IS NULL')
      .andWhere('item.status = :status', { status: ItemStatus.AVAILABLE });

    //  search
    if (filters.search) {
      query.andWhere('LOWER(item.title) LIKE LOWER(:search)', {
        search: `%${filters.search}%`,
      });
    }

    //  category
    if (filters.category) {
      query.andWhere('item.category = :category', {
        category: filters.category,
      });
    }

    //  condition
    if (filters.condition) {
      query.andWhere('item.condition = :condition', {
        condition: filters.condition,
      });
    }

    //  location (join users)
    if (filters.district || filters.province) {
      const ownerQuery = this.userRepository
        .createQueryBuilder('owner')
        .select('owner.id', 'id')
        .where('owner.deleted_at IS NULL');

      if (filters.district) {
        ownerQuery.andWhere('LOWER(TRIM(owner.district)) = LOWER(TRIM(:district))', {
          district: filters.district,
        });
      }

      if (filters.province) {
        ownerQuery.andWhere('LOWER(TRIM(owner.province)) = LOWER(TRIM(:province))', {
          province: filters.province,
        });
      }

      const owners = await ownerQuery.getRawMany<{ id: string }>();

      if (owners.length === 0) {
        await this.redisService.set(cacheKey, JSON.stringify([]), 60);
        return {
          success: true,
          message: 'Items fetched from database',
          data: [],
        };
      }

      query.andWhere('item.owner_id IN (:...ownerIds)', {
        ownerIds: owners.map((owner) => owner.id),
      });
    }

          const items = await query
        .orderBy('item.created_at', 'DESC')
        .getMany();

      //  fetch images for all items
      const itemIds = items.map((item) => item.id);

      let imagesMap: Record<string, string[]> = {};

      if (itemIds.length > 0) {
        const images = await this.itemImageRepository.find({
          where: {
            itemId: In(itemIds),
          },
        });

        // group images by itemId
        imagesMap = images.reduce((acc, img) => {
          if (!acc[img.itemId]) {
            acc[img.itemId] = [];
          }
          acc[img.itemId].push(img.imageUrl);
          return acc;
        }, {} as Record<string, string[]>);
      }

      //  merge images into items
      const itemsWithImages = items.map((item) => ({
        ...item,
        images: imagesMap[item.id] || [],
      }));

    //  cache result
    await this.redisService.set(
      cacheKey,
      JSON.stringify(itemsWithImages),
      60,
    );

    return {
      success: true,
      message: 'Items fetched from database',
      data: itemsWithImages,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to fetch items');
  }
}

async getItemById(itemId: string) {
  try {
    // check cache first
    const cacheKey = `inventory:item:${itemId}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return {
        success: true,
        message: 'Item fetched from cache',
        data: JSON.parse(cached),
      };
    }

    // fetch item
    const item = await this.itemRepository.findOne({
      where: {
        id: itemId,
        deletedAt: IsNull(),
        status: ItemStatus.AVAILABLE,
      },
    });

    if (!item) {
      throw new BadRequestException('Item not found');
    }

    // fetch images
    const images = await this.itemImageRepository.find({
      where: { itemId },
    });

    const itemWithImages = {
      ...item,
      images: images.map((img) => img.imageUrl),
    };

    // cache for 60 seconds
    await this.redisService.set(cacheKey, JSON.stringify(itemWithImages), 60);

    return {
      success: true,
      message: 'Item fetched from database',
      data: itemWithImages,
    };
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to fetch item');
  }
}

async getMyItems(userId: string, includeSwapped = false) {
  try {
    const cacheKey = `inventory:items:my:${userId}:${includeSwapped}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return {
        success: true,
        message: 'Items fetched from cache',
        data: JSON.parse(cached),
      };
    }

    const whereClause: {
      ownerId: string;
      deletedAt: ReturnType<typeof IsNull>;
      status?: ItemStatus;
    } = {
      ownerId: userId,
      deletedAt: IsNull(),
    };

    if (!includeSwapped) {
      whereClause.status = ItemStatus.AVAILABLE;
    }

    const items = await this.itemRepository.find({
      where: whereClause,
      order: { createdAt: 'DESC' },
    });

    const itemIds = items.map((item) => item.id);
    let imagesMap: Record<string, string[]> = {};

    if (itemIds.length > 0) {
      const images = await this.itemImageRepository.find({
        where: { itemId: In(itemIds) },
      });

      imagesMap = images.reduce((acc, img) => {
        if (!acc[img.itemId]) {
          acc[img.itemId] = [];
        }
        acc[img.itemId].push(img.imageUrl);
        return acc;
      }, {} as Record<string, string[]>);
    }

    const itemsWithImages = items.map((item) => ({
      ...item,
      images: imagesMap[item.id] || [],
    }));

    await this.redisService.set(cacheKey, JSON.stringify(itemsWithImages), 60);

    return {
      success: true,
      message: 'Items fetched from database',
      data: itemsWithImages,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to fetch user items');
  }
}

async updateItem(
  itemId: string,
  userId: string,
  dto: UpdateItemDto,
  files: Express.Multer.File[] = [],
) {
  try {
    const item = await this.itemRepository.findOne({
      where: { id: itemId, deletedAt: IsNull() },
    });

    if (!item) {
      throw new BadRequestException('Item not found');
    }

    if (item.ownerId !== userId) {
      throw new ForbiddenException('Not allowed to update this item');
    }

    if (item.status === ItemStatus.SWAPPED) {
      throw new BadRequestException('Swapped items cannot be edited');
    }

    if (dto.title !== undefined) item.title = dto.title;
    if (dto.description !== undefined) item.description = dto.description;
    if (dto.category !== undefined) item.category = dto.category;
    if (dto.condition !== undefined) item.condition = dto.condition;

    const updated = await this.itemRepository.save(item);

    const existingImages = await this.itemImagesService.getImagesByItemId(itemId);

    const keepImageUrls = dto.keepImageUrls ?? existingImages.map((img) => img.imageUrl);

    const imageUrlsToDelete = existingImages
      .map((img) => img.imageUrl)
      .filter((url) => !keepImageUrls.includes(url));

    if (imageUrlsToDelete.length > 0) {
      await this.itemImagesService.deleteByItemIdAndUrls(itemId, imageUrlsToDelete);

      for (const imageUrl of imageUrlsToDelete) {
        await this.storageService.delete?.(imageUrl);
      }
    }

    if (files.length > 0) {
      const newImageUrls: string[] = [];

      for (const file of files) {
        const uploadedUrl = await this.storageService.upload(file.buffer);
        newImageUrls.push(uploadedUrl);
      }

      await this.itemImagesService.saveImages(itemId, newImageUrls);
    }

    const refreshedImages = await this.itemImagesService.getImagesByItemId(itemId);

    await this.invalidateItemCaches(itemId);

    return {
      success: true,
      message: 'Item updated successfully',
      data: {
        ...updated,
        images: refreshedImages.map((img) => img.imageUrl),
      },
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof ForbiddenException
    ) {
      throw error;
    }

    throw new InternalServerErrorException('Failed to update item');
  }
}

async softDeleteItem(itemId: string, userId: string) {
  try {
    const item = await this.itemRepository.findOne({
      where: { id: itemId, deletedAt: IsNull() },
    });

    if (!item) {
      throw new BadRequestException('Item not found');
    }

    if (item.ownerId !== userId) {
      throw new ForbiddenException('Not allowed to delete this item');
    }

    if (item.status === ItemStatus.SWAPPED) {
      throw new BadRequestException('Swapped items cannot be deleted');
    }

    await this.itemRepository.softDelete(itemId);
    await this.invalidateItemCaches(itemId);

    return {
      success: true,
      message: 'Item deleted successfully',
      data: null,
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof ForbiddenException
    ) {
      throw error;
    }

    throw new InternalServerErrorException('Failed to delete item');
  }
}
}