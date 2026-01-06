import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  async listAll() {
    return this.authorsRepository.find({
      order: { id: 'ASC' },
    });
  }

  async getOne(id: number) {
    const author = await this.authorsRepository.findOneBy({ id });
    if (!author) throw new NotFoundException(`Author with id ${id} not found`);
    return author;
  }

  async create(createAuthor: CreateAuthorDto) {
    const author = this.authorsRepository.create(createAuthor);
    return this.authorsRepository.save(author);
  }

  async update(id: number, updateAuthor: UpdateAuthorDto) {
    const author = await this.getOne(id);
    Object.assign(author, updateAuthor);
    return this.authorsRepository.save(author);
  }

  async delete(id: number) {
    const author = await this.getOne(id);
    return this.authorsRepository.remove(author);
  }
}
