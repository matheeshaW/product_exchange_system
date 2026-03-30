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

@Injectable()
export class SwapsService {
  constructor(
    @InjectRepository(Swap)
    private readonly swapRepository: Repository<Swap>,
  ) {}

  async createSwap(dto: CreateSwapDto, userId: string) {
    try {
      if (dto.requestedItemId === dto.offeredItemId) {
        throw new BadRequestException('Cannot swap same item');
      }

      const swap = this.swapRepository.create({
        requesterId: userId,
        requestedItemId: dto.requestedItemId,
        offeredItemId: dto.offeredItemId,
        ownerId: '', // we fix this next
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