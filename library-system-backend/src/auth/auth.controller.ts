import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
  Request,
  Param,        
  ParseIntPipe, 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/registerUserDto';
import { LoginUserDto } from './dtos/loginUserDto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';  
import { Role } from './role.decorator';      

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body(ValidationPipe) loginUser: LoginUserDto) {
    const user = await this.authService.validateUser(loginUser);
    if (!user) throw new UnauthorizedException('Wrong username or password');
    return this.authService.login(user);
  }

  @Post('register')
  create(@Body(ValidationPipe) registerUser: RegisterUserDto) {
    return this.authService.register(registerUser);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // Tüm kullanıcıları listele (sadece admin ve librarian)
  @Get('users')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin', 'librarian')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  // Belirli bir kullanıcıyı getir
  @Get('users/:id')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getUserById(id);
  }
}