import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class ProductsService {
  constructor(
  @InjectRepository(Product)
  private readonly productRepository: Repository<Product>,
  private readonly redisService: RedisService,
) {}

  async createProduct(dto: CreateProductDto, userId: string) {
    try {
      const product = this.productRepository.create({
        ...dto,
        createdBy: userId,
      });

      const saved = await this.productRepository.save(product);

      // invalidate cache
      await this.redisService.del('inventory:products:list');

      return {
        success: true,
        message: 'Product created successfully',
        data: saved,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async getProducts() {
  try {
    const cacheKey = 'inventory:products:list';

    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return {
        success: true,
        message: 'Products fetched from cache',
        data: JSON.parse(cached),
      };
    }

    const products = await this.productRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    await this.redisService.set(
      cacheKey,
      JSON.stringify(products),
      60, // TTL 60s
    );

    return {
      success: true,
      message: 'Products fetched from database',
      data: products,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to fetch products');
  }
}
}