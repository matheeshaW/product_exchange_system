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
import { User } from '../users/entities/user.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class SwapsService {
  constructor(
    @InjectRepository(Swap)
    private readonly swapRepository: Repository<Swap>,

    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly auditService: AuditService,
  ) { }

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

      // offered item must belong to requester
      if (dto.offeredItemId) {
        const offeredItem = await this.itemRepository.findOne({
          where: { id: dto.offeredItemId },
        });

        if (!offeredItem) {
          throw new BadRequestException('Offered item not found');
        }

        if (offeredItem.ownerId !== userId) {
          throw new BadRequestException('You can only offer your own item');
        }
      }

      // create swap
      const swap = this.swapRepository.create({
        requesterId: userId,
        ownerId: requestedItem.ownerId,
        requestedItemId: dto.requestedItemId,
        offeredItemId: dto.isDonation ? null : dto.offeredItemId,
        isDonation: dto.isDonation,
      });

      const saved = await this.swapRepository.save(swap);
      try{
      await this.auditService.logAction({
        entityType: 'SWAP',
        entityId: saved.id,
        action: 'CREATED',
        userId: userId,
      });
    }catch (auditError) {
      console.error('Audit enqueuq failt for SWAP create:', auditError);
    }

      return saved;
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

  async getMySwaps(userId: string) {
    try {
      const swaps = await this.swapRepository.find({
        where: [
          { requesterId: userId },
          { ownerId: userId },
        ],
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        success: true,
        message: 'Swaps fetched successfully',
        data: swaps,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch swaps');
    }
  }


  async getSwapContacts(swapId: string, userId: string) {
    try {
      const swap = await this.swapRepository.findOne({
        where: { id: swapId },
      });

      if (!swap) {
        throw new BadRequestException('Swap not found');
      }

      //  access control
      if (
        swap.requesterId !== userId &&
        swap.ownerId !== userId
      ) {
        throw new ForbiddenException('Access denied');
      }

      //  must be accepted
      if (swap.status !== SwapStatus.ACCEPTED) {
        throw new BadRequestException(
          'Contacts available only after approval',
        );
      }

      //  fetch users
      const requester = await this.userRepository.findOne({
        where: { id: swap.requesterId },
      });

      const owner = await this.userRepository.findOne({
        where: { id: swap.ownerId },
      });

      return {
        success: true,
        message: 'Contact details fetched successfully',
        data: {
          requester: {
            name: requester?.name,
            email: requester?.email,
            phone: requester?.phone,
          },
          owner: {
            name: owner?.name,
            email: owner?.email,
            phone: owner?.phone,
          },
        },
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to fetch contacts',
      );
    }
  }
}