import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Auth
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { Role } from './entities/role.entity';

// Entities
import { Book } from './entities/book.entity';
import { Author } from './entities/author.entity';
import { Category } from './entities/category.entity';
import { Borrow } from './entities/borrow.entity';


// Feature Modules
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { BorrowsModule } from './borrows/borrows.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'library_admin',
      password: 'Library2024!',
      database: 'library_system',
      entities: [User, Role, Book, Author, Category, Borrow],
      synchronize: true, 
      logging: true,
    }),
    AuthModule,
    BooksModule,
    AuthorsModule,
    BorrowsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
