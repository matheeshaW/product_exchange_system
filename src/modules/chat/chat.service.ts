import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Swap } from '../swaps/entities/swap.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    @InjectRepository(Swap)
    private readonly swapRepo: Repository<Swap>
  ) { }

  async saveMessage(
    swapId: string,
    senderId: string,
    message: string,
  ) {
    const msg = this.messageRepo.create({
      swapId,
      senderId,
      message,
    });

    return this.messageRepo.save(msg);
  }



async getMessagesBySwap(
  swapId: string,
  userId: string,
  page: number = 1,
  limit: number = 20,
) {
  const swap = await this.swapRepo.findOne({
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

  const [messages, total] = await this.messageRepo.findAndCount({
    where: { swapId },
    order: { createdAt: 'DESC' },
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    success: true,
    message: 'Messages fetched successfully',
    data: messages.reverse(),
    meta: {
      total,
      page,
      limit,
    },
  };
}
}