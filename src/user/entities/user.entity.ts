// user.entity.ts
import { Transaction } from 'src/transaction/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 1000 })
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.sender)
  @JoinColumn()
  sentTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.recipient)
  @JoinColumn()
  receivedTransactions: Transaction[];
}
