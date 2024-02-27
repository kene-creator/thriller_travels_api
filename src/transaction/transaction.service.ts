import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly userService: UserService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async transferCredits(
    senderId: string,
    recipientId: string,
    amount: number,
    fee: number,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const sender = await this.userService.getUserBalance(senderId);
      if (sender.balance < amount + fee) {
        throw new Error('Insufficient balance');
      }

      const recipient = await this.userService.getUserBalance(recipientId);

      await this.userService.updateUserBalance(
        senderId,
        +sender.balance - amount - fee,
      );
      await this.userService.updateUserBalance(
        recipientId,
        +recipient.balance + amount,
      );

      const newTransaction = manager.create(Transaction, {
        sender,
        recipient,
        amount,
        fee,
        timestamp: new Date(),
      });

      await manager.save(newTransaction);
    });
  }
  async getTransactionHistory(userId: number): Promise<Transaction[]> {
    const history = await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.sender', 'sender')
      .leftJoinAndSelect('transaction.recipient', 'recipient')
      .where(
        'transaction.senderId = :userId OR transaction.recipientId = :userId',
        { userId },
      )
      .getMany();
    return history;
  }
}
