import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Author } from './author.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  isbn: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  publishYear: number;

  @Column({ default: 0 })
  availableCopies: number;

  @Column({ default: 0 })
  totalCopies: number;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, category => category.books, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToMany(() => Author, author => author.books, { eager: true })
  @JoinTable({
    name: 'book_authors',
    joinColumn: { name: 'bookId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'authorId', referencedColumnName: 'id' }
  })
  authors: Author[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}