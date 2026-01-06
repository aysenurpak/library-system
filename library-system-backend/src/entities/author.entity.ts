import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { Book } from './book.entity';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  biography: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @ManyToMany(() => Book, book => book.authors)
  books: Book[];

  @CreateDateColumn()
  createdAt: Date;
}