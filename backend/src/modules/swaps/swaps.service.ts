import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { Swap, SwapStatus } from './entities/swap.entity';
import { CreateSwapDto } from './dto/create-swap.dto';
import { UpdateSwapDto } from './dto/update-swap.dto';
import { Item, ItemStatus } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { AuditService } from '../audit/audit.service';
import { RedisService } from 'src/common/redis/redis.service';

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
    private readonly redisService: RedisService,
  ) { }

  async createSwap(dto: CreateSwapDto, userId: string) {
    try {
      // cannot swap same item
      if (dto.requestedItemId === dto.offeredItemId) {
        throw new BadRequestException('Cannot swap same item');
      }

      // get requested item
      const requestedItem = await this.itemRepository.findOne({
        where: {
          id: dto.requestedItemId,
          deletedAt: IsNull(),
          status: ItemStatus.AVAILABLE,
        },
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
          where: {
            id: dto.offeredItemId,
            deletedAt: IsNull(),
            status: ItemStatus.AVAILABLE,
          },
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

      if (swap.status !== SwapStatus.PENDING) {
        throw new BadRequestException('Swap is already finalized');
      }

      if (dto.status === SwapStatus.ACCEPTED) {
        await this.swapRepository.manager.transaction(async (manager) => {
          const requestedItem = await manager.findOne(Item, {
            where: {
              id: swap.requestedItemId,
              deletedAt: IsNull(),
              status: ItemStatus.AVAILABLE,
            },
          });

          if (!requestedItem) {
            throw new BadRequestException('Requested item is no longer available');
          }

          requestedItem.status = ItemStatus.SWAPPED;
          await manager.save(Item, requestedItem);

          if (swap.offeredItemId) {
            const offeredItem = await manager.findOne(Item, {
              where: {
                id: swap.offeredItemId,
                deletedAt: IsNull(),
                status: ItemStatus.AVAILABLE,
              },
            });

            if (!offeredItem) {
              throw new BadRequestException('Offered item is no longer available');
            }

            offeredItem.status = ItemStatus.SWAPPED;
            await manager.save(Item, offeredItem);
          }

          swap.status = dto.status;
          await manager.save(Swap, swap);
        });

        await this.redisService.deleteByPrefix('inventory:items:');
        await this.redisService.deleteByPrefix('inventory:item:');

        return this.swapRepository.findOne({ where: { id: swapId } });
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

      const itemIds = swaps
        .flatMap((swap) => [swap.requestedItemId, swap.offeredItemId])
        .filter((id): id is string => Boolean(id));

      const uniqueItemIds = [...new Set(itemIds)];

      let itemMap: Record<string, Item> = {};

      if (uniqueItemIds.length > 0) {
        const items = await this.itemRepository.find({
          where: {
            id: In(uniqueItemIds),
            deletedAt: IsNull(),
          },
        });

        itemMap = items.reduce(
          (acc, item) => {
            acc[item.id] = item;
            return acc;
          },
          {} as Record<string, Item>,
        );
      }

      const enriched = swaps.map((swap) => ({
        ...swap,
        requestedItem: itemMap[swap.requestedItemId] || null,
        offeredItem: swap.offeredItemId
          ? (itemMap[swap.offeredItemId] || null)
          : null,
      }));

      return {
        success: true,
        message: 'Swaps fetched successfully',
        data: enriched,
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