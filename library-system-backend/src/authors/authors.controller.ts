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
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.decorator';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin', 'librarian', 'member')
  listAll() {
    return this.authorsService.listAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  show(@Param('id', ParseIntPipe) id: number) {
    return this.authorsService.getOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin', 'librarian')
  create(@Body(ValidationPipe) createAuthor: CreateAuthorDto) {
    return this.authorsService.create(createAuthor);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin', 'librarian')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body(ValidationPipe) updateAuthor: UpdateAuthorDto,
  ) {
    return this.authorsService.update(+id, updateAuthor);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin')
  delete(@Param('id', ParseIntPipe) id: string) {
    return this.authorsService.delete(+id);
  }
}
