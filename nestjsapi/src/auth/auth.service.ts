import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        'E-mail ou senha incorretos.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new HttpException(
        'E-mail ou senha incorretos.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { id: user.id, name: user.name };

    return { access_token: this.jwtService.sign(payload) };
  }
}
