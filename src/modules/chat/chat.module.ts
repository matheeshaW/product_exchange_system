import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { Swap } from '../swaps/entities/swap.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Swap])],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
