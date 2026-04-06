import { IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateSwapDto {
  @IsUUID()
  requestedItemId!: string;

  @IsOptional()
  @IsUUID()
  offeredItemId?: string;

  @IsBoolean()
  isDonation!: boolean;
}