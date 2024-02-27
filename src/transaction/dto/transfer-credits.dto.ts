// transfer-credits.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransferCreditsDto {
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  recipientId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
