import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Swap } from '../swaps/entities/swap.entity';

@WebSocketGateway({
  namespace: '/swaps',
  cors: true,
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService,
    @InjectRepository(Swap)
    private readonly swapRepository: Repository<Swap>,
  ) { }


  handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      );

      client.data.user = {
        userId: decoded.sub,
        email: decoded.email,
      };
    } catch (error) {
      client.disconnect();
    }
  }

  @SubscribeMessage('join_swap')
  async handleJoin(
    @MessageBody() swapId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;

    if (!user) {
      client.disconnect();
      return;
    }

    const swap = await this.swapRepository.findOne({
      where: { id: swapId },
    });

    if (!swap) {
      client.disconnect();
      return;
    }

    //  access control
    if (
      swap.requesterId !== user.userId &&
      swap.ownerId !== user.userId
    ) {
      client.disconnect();
      return;
    }

    client.join(swapId);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    data: {
      swapId: string;
      message: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;

    if (!user) {
      client.disconnect();
      return;
    }

    const swap = await this.swapRepository.findOne({
      where: { id: data.swapId },
    });

    if (!swap) {
      client.disconnect();
      return;
    }

    if (
      swap.requesterId !== user.userId &&
      swap.ownerId !== user.userId
    ) {
      client.disconnect();
      return;
    }

    const saved = await this.chatService.saveMessage(
      data.swapId,
      user.userId,
      data.message,
    );

    this.server.to(data.swapId).emit('receive_message', saved);
  }
}