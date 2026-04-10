import { IsString, MinLength, MaxLength } from 'class-validator';

export class DeleteAccountDto {
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password!: string;
}
