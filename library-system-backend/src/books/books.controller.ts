import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin', 'librarian', 'member')
  listAll() {
    return this.booksService.listAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  show(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.getOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin', 'librarian')
  create(@Body(ValidationPipe) createBook: CreateBookDto) {
    return this.booksService.create(createBook);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin', 'librarian')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body(ValidationPipe) updateBook: UpdateBookDto,
  ) {
    return this.booksService.update(+id, updateBook);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin')
  delete(@Param('id', ParseIntPipe) id: string) {
    return this.booksService.delete(+id);
  }
}
