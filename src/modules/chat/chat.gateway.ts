import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  namespace: '/swaps',
  cors: true,
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('join_swap')
  handleJoin(
    @MessageBody() swapId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(swapId);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    data: {
      swapId: string;
      senderId: string;
      message: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const saved = await this.chatService.saveMessage(
      data.swapId,
      data.senderId,
      data.message,
    );

    this.server.to(data.swapId).emit('receive_message', saved);
  }
}