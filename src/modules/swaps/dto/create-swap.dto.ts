import { IsUUID } from 'class-validator';

export class CreateSwapDto {
  @IsUUID()
  requestedItemId!: string;

  @IsUUID()
  offeredItemId!: string;
}