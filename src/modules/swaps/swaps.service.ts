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
    if (dto.requestedItemId === dto.offeredItemId) {
      throw new BadRequestException('Cannot swap same item');
    }

    // GET THE REQUESTED ITEM FROM DB
    const requestedItem = await this.itemRepository.findOne({
      where: { id: dto.requestedItemId },
    });

    if (!requestedItem) {
      throw new BadRequestException('Requested item not found');
    }

    //  CREATE SWAP WITH CORRECT ownerId
    const swap = this.swapRepository.create({
      requesterId: userId,
      ownerId: requestedItem.ownerId, // owner id added
      requestedItemId: dto.requestedItemId,
      offeredItemId: dto.offeredItemId,
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