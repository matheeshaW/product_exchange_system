import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

@Post()
@UseInterceptors(FilesInterceptor('images', 5))
createItem(
  @Body() dto: CreateItemDto,
  @Request() req,
  @UploadedFiles() files: Express.Multer.File[],
) {
  return this.itemsService.createItem(dto, req.user.userId, files);
}

  @Get()
  getItems() {
    return this.itemsService.getItems();
  }
}