import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dtos/registerUserDto';
import { LoginUserDto } from './dtos/loginUserDto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtSercive: JwtService,
  ) {}

  async validateUser(loginUser: LoginUserDto) {
    const user = await this.usersRepository.findOneBy({
      username: loginUser.username,
    });
    if (!user) return null;

    const ok = await bcrypt.compare(loginUser.password, user.password);
    return ok ? user : null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      accessToken: this.jwtSercive.sign(payload),
    };
  }

  async register(registerUser: RegisterUserDto) {
    const user = this.usersRepository.create(registerUser);
    user.password = bcrypt.hashSync(registerUser.password, 10);
    return this.usersRepository.save(user);
  }
  async getAllUsers() {
  return this.usersRepository.find({
    select: ['id', 'username', 'role', 'fullName', 'email'],
  });
}

async getUserById(id: number) {
  const user = await this.usersRepository.findOne({
    where: { id },
    select: ['id', 'username', 'role', 'fullName', 'email'],
  });
  if (!user) throw new NotFoundException('User not found');
  return user;
}
}
