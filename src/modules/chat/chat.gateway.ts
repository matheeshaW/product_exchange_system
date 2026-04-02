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

@WebSocketGateway({
  namespace: '/swaps',
  cors: true,
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) { }


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
      message: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    // 🔥 extract user from handshake
    const user = client.data.user;

    if (!user) {
      throw new Error('Unauthorized');
    }

    const saved = await this.chatService.saveMessage(
      data.swapId,
      user.userId, // ✅ from token
      data.message,
    );

    this.server.to(data.swapId).emit('receive_message', saved);
  }
}