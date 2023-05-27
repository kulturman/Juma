import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
