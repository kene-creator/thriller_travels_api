import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransferCreditsDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async transferCredits(@Body() transferCreditsDto: TransferCreditsDto) {
    const { senderId, recipientId, amount } = transferCreditsDto;

    const feePercentage = this.configService.get<number>(
      'TRANSACTION_FEE_PERCENTAGE',
    );
    const fee = amount * feePercentage;

    return this.transactionService.transferCredits(
      senderId,
      recipientId,
      amount,
      fee,
    );
  }

  @Get(':userId/history')
  async getTransactionHistory(@Param('userId') userId: number) {
    return this.transactionService.getTransactionHistory(userId);
  }
}
