import { Controller, Get, Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
constructor(private readonly productsService: ProductsService) {}

 @Get()
getProducts(@Req() req) {

  const user = req.user;
  console.log(user);
}
}
