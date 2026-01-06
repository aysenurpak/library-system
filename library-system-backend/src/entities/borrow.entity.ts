import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/user.entity';
import { Book } from './book.entity';

@Entity('borrows')
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  bookId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Book, { eager: true })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column({ type: 'timestamp' })
  borrowDate: Date;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnDate: Date;

  @Column({ default: 'BORROWED' }) // BORROWED, RETURNED, OVERDUE
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}