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
import { BorrowsService } from './borrows.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.decorator';

@Controller('borrows')
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin', 'librarian')
  listAll() {
    return this.borrowsService.listAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  show(@Param('id', ParseIntPipe) id: number) {
    return this.borrowsService.getOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin', 'librarian')
  create(@Body(ValidationPipe) createBorrow: CreateBorrowDto) {
    return this.borrowsService.create(createBorrow);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin', 'librarian')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body(ValidationPipe) updateBorrow: UpdateBorrowDto,
  ) {
    return this.borrowsService.update(+id, updateBorrow);
  }

  @Patch('return/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin', 'librarian')
  returnBook(@Param('id', ParseIntPipe) id: string) {
    return this.borrowsService.returnBook(+id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin')
  delete(@Param('id', ParseIntPipe) id: string) {
    return this.borrowsService.delete(+id);
  }
  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  getUserBorrows(@Param('userId', ParseIntPipe) userId: number) {
    return this.borrowsService.getUserBorrows(userId);

}
}
