import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SwapsService } from './swaps.service';
import { CreateSwapDto } from './dto/create-swap.dto';
import { UpdateSwapDto } from './dto/update-swap.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('swaps')
@UseGuards(JwtAuthGuard)
export class SwapsController {
  constructor(private readonly swapsService: SwapsService) { }

  @Get()
  getMySwaps(@Request() req) {
    return this.swapsService.getMySwaps(req.user.userId);
  }

  @Post()
  createSwap(@Body() dto: CreateSwapDto, @Request() req) {
    return this.swapsService.createSwap(dto, req.user.userId);
  }

  @Patch(':id')
  updateSwap(
    @Param('id') id: string,
    @Body() dto: UpdateSwapDto,
    @Request() req,
  ) {
    return this.swapsService.updateSwap(
      id,
      dto,
      req.user.userId,
    );
  }

  @Get(':id/contact')
  getContacts(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req,
  ) {
    return this.swapsService.getSwapContacts(
      id,
      req.user.userId,
    );
  }
}