import { IsString, IsInt, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(150)
  name!: string;

  @IsString()
  @MaxLength(500)
  description?: string;

  @IsInt()
  @Min(0)
  price!: number;

  @IsInt()
  @Min(0)
  stock!: number;
}