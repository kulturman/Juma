import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserJtwPayload } from './userJtwPayload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getUser(id: string) {
    const user = await this.userRepository.findOne({ id: +id });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async authenticateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return new UserJtwPayload(user.id.toString(), user.email);
    }

    return null;
  }

  generateToken(payload: UserJtwPayload) {
    return this.jwtService.sign(
      { ...payload },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      },
    );
  }
}
