import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly redisService: RedisService,
  ) {}

  async createItem(dto: CreateItemDto, userId: string) {
    try {
      const item = this.itemRepository.create({
        ...dto,
        ownerId: userId,
      });

      const saved = await this.itemRepository.save(item);

      // invalidate cache
      await this.redisService.del('inventory:items:list');

      return {
        success: true,
        message: 'Item created successfully',
        data: saved,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create item');
    }
  }

  async getItems() {
    try {
      const cacheKey = 'inventory:items:list';

      const cached = await this.redisService.get(cacheKey);

      if (cached) {
        return {
          success: true,
          message: 'Items fetched from cache',
          data: JSON.parse(cached),
        };
      }

      const items = await this.itemRepository.find({
        where: { deletedAt: IsNull() },
        order: { createdAt: 'DESC' },
      });

      await this.redisService.set(
        cacheKey,
        JSON.stringify(items),
        60,
      );

      return {
        success: true,
        message: 'Items fetched from database',
        data: items,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch items');
    }
  }
}