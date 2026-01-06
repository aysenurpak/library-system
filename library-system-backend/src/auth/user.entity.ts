import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Borrow } from '../entities/borrow.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string; // 'admin', 'librarian', 'member'

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @OneToMany(() => Borrow, (borrow) => borrow.user)
  borrows: Borrow[];

 
}