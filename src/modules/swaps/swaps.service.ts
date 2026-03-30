import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Swap, SwapStatus } from './entities/swap.entity';
import { CreateSwapDto } from './dto/create-swap.dto';
import { UpdateSwapDto } from './dto/update-swap.dto';
import { Item } from '../items/entities/item.entity';

@Injectable()
export class SwapsService {
  constructor(
    @InjectRepository(Swap)
    private readonly swapRepository: Repository<Swap>,

    @InjectRepository(Item) 
    private readonly itemRepository: Repository<Item>,
  ) {}

async createSwap(dto: CreateSwapDto, userId: string) {
  try {
    // cannot swap same item
    if (dto.requestedItemId === dto.offeredItemId) {
      throw new BadRequestException('Cannot swap same item');
    }

    // get requested item
    const requestedItem = await this.itemRepository.findOne({
      where: { id: dto.requestedItemId },
    });

    if (!requestedItem) {
      throw new BadRequestException('Requested item not found');
    }

    // prevent requesting your own item
    if (requestedItem.ownerId === userId) {
      throw new BadRequestException('Cannot request your own item');
    }

    // donation validation
    if (!dto.isDonation && !dto.offeredItemId) {
      throw new BadRequestException(
        'Offered item required for swap',
      );
    }

    // create swap
    const swap = this.swapRepository.create({
      requesterId: userId,
      ownerId: requestedItem.ownerId,
      requestedItemId: dto.requestedItemId,
      offeredItemId: dto.isDonation ? null : dto.offeredItemId,
      isDonation: dto.isDonation,
    });

    return this.swapRepository.save(swap);
  } catch (error) {
    if (error instanceof BadRequestException) throw error;

    throw new InternalServerErrorException('Failed to create swap');
  }
}

  async updateSwap(
    swapId: string,
    dto: UpdateSwapDto,
    userId: string,
  ) {
    try {
      const swap = await this.swapRepository.findOne({
        where: { id: swapId },
      });

      if (!swap) {
        throw new BadRequestException('Swap not found');
      }

      if (swap.ownerId !== userId) {
        throw new ForbiddenException('Not allowed');
      }

      swap.status = dto.status;

      return this.swapRepository.save(swap);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      )
        throw error;

      throw new InternalServerErrorException('Failed to update swap');
    }
  }
}