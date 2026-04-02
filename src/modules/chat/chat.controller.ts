import {
    Controller,
    Get,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get(':swapId')
    getMessages(
        @Param('swapId') swapId: string,
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Request() req,
    ) {
        return this.chatService.getMessagesBySwap(
            swapId,
            req.user.userId, // 🔥 pass user
            Number(page) || 1,
            Number(limit) || 20,
        );
    }
}