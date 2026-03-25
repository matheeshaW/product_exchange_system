import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(dto: CreateProductDto, userId: string) {
    try {
      const product = this.productRepository.create({
        ...dto,
        createdBy: userId,
      });

      const saved = await this.productRepository.save(product);

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
      const products = await this.productRepository.find({
        where: { deletedAt: IsNull() },
        order: { createdAt: 'DESC' },
      });

      return {
        success: true,
        message: 'Products fetched successfully',
        data: products,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }
}