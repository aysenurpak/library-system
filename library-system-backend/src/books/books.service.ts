import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { Author } from '../entities/author.entity';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private booksRepository: Repository<Book>,
    @InjectRepository(Author) private authorsRepository: Repository<Author>,
    @InjectRepository(Category) private categoriesRepository: Repository<Category>,
  ) {}

  async listAll() {
    return this.booksRepository.find({
      relations: ['category', 'authors'],
      order: { id: 'ASC' },
    });
  }

  async getOne(id: number) {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: ['category', 'authors'],
    });
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);
    return book;
  }

  async create(createBook: CreateBookDto) {
    // Yazarları bul
    const authors = await this.authorsRepository.findByIds(createBook.authorIds);
    if (authors.length !== createBook.authorIds.length) {
      throw new NotFoundException('One or more authors not found');
    }

    // Kategoriyi kontrol et
    const category = await this.categoriesRepository.findOne({
      where: { id: createBook.categoryId }
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Kitabı oluştur
    const book = this.booksRepository.create({
      ...createBook,
      authors,
      category,
    });

    return this.booksRepository.save(book);
  }

  async update(id: number, updateBook: UpdateBookDto) {
    const book = await this.getOne(id);

    // Eğer authorIds varsa yazarları güncelle
    if (updateBook.authorIds) {
      const authors = await this.authorsRepository.findByIds(updateBook.authorIds);
      book.authors = authors;
    }

    // Diğer alanları güncelle
    Object.assign(book, updateBook);
    return this.booksRepository.save(book);
  }

  async delete(id: number) {
    const book = await this.getOne(id);
    return this.booksRepository.remove(book);
  }
}