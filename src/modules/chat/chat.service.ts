import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

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
}