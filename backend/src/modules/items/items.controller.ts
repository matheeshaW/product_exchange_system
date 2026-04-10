import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  Query,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  createItem(
    @Body() dto: CreateItemDto,
    @Request() req,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.itemsService.createItem(dto, req.user.userId, files);
  }

  @Get()
  getItems(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('condition') condition?: string,
    @Query('district') district?: string,
    @Query('province') province?: string,
  ) {
    return this.itemsService.getItems({
      search,
      category,
      condition,
      district,
      province,
    });
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyItems(@Request() req) {
    return this.itemsService.getMyItems(req.user.userId);
  }

  @Get(':id')
  getItemById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.itemsService.getItemById(id);
  }
}