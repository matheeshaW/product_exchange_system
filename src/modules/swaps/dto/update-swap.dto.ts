import { IsEnum } from 'class-validator';
import { SwapStatus } from '../entities/swap.entity';

export class UpdateSwapDto {
  @IsEnum(SwapStatus)
  status!: SwapStatus;
}