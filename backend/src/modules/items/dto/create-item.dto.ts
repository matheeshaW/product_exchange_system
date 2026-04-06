import { IsString, MaxLength } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @MaxLength(150)
  title!: string;

  @IsString()
  @MaxLength(500)
  description?: string;

  @IsString()
  @MaxLength(100)
  category!: string;

  @IsString()
  @MaxLength(50)
  condition!: string;
}