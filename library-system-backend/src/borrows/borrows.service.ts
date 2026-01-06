import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrow } from '../entities/borrow.entity';
import { Book } from '../entities/book.entity';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';

@Injectable()
export class BorrowsService {
  constructor(
    @InjectRepository(Borrow)
    private borrowsRepository: Repository<Borrow>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async listAll() {
    return this.borrowsRepository.find({
      relations: ['user', 'book'],
      order: { id: 'DESC' },
    });
  }

  async getOne(id: number) {
    const borrow = await this.borrowsRepository.findOne({
      where: { id },
      relations: ['user', 'book'],
    });
    if (!borrow) throw new NotFoundException(`Borrow with id ${id} not found`);
    return borrow;
  }

  async create(createBorrow: CreateBorrowDto) {
    // Kitabı kontrol et
    const book = await this.booksRepository.findOne({
      where: { id: createBorrow.bookId }
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Stok kontrolü
    if (book.availableCopies <= 0) {
      throw new BadRequestException('No available copies of this book');
    }

    // Ödünç kaydı oluştur
    const borrow = this.borrowsRepository.create({
      ...createBorrow,
      status: 'BORROWED',
    });

    // Kitap stoğunu azalt
    book.availableCopies -= 1;
    await this.booksRepository.save(book);

    return this.borrowsRepository.save(borrow);
  }

  async update(id: number, updateBorrow: UpdateBorrowDto) {
    const borrow = await this.getOne(id);
    Object.assign(borrow, updateBorrow);
    return this.borrowsRepository.save(borrow);
  }

  async delete(id: number) {
    const borrow = await this.getOne(id);
    
    // Eğer kitap iade edilmemişse, stoğu geri ekle
    if (borrow.status === 'BORROWED') {
      const book = await this.booksRepository.findOne({
        where: { id: borrow.bookId }
      });
      if (book) {
        book.availableCopies += 1;
        await this.booksRepository.save(book);
      }
    }
    
    return this.borrowsRepository.remove(borrow);
  }

  // Kitap iade etme
  async returnBook(id: number) {
    const borrow = await this.getOne(id);

    if (borrow.status === 'RETURNED') {
      throw new BadRequestException('Book already returned');
    }

    // İade tarihini ayarla
    borrow.returnDate = new Date();
    borrow.status = 'RETURNED';

    // Kitap stoğunu artır
    const book = await this.booksRepository.findOne({
      where: { id: borrow.bookId }
    });

    if (book) {
      book.availableCopies += 1;
      await this.booksRepository.save(book);
    }

    return this.borrowsRepository.save(borrow);
  }

  // Kullanıcının ödünç aldığı kitapları listele
  async getUserBorrows(userId: number) {
    return this.borrowsRepository.find({
      where: { userId },
      relations: ['book'],
      order: { borrowDate: 'DESC' },
    });
  }
}