import { AuthRepository } from '../../../../hexagon/gateways/repositories/authRepository';
import { User } from '../../../../hexagon/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class DbAuthRepository implements AuthRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  find(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  getByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ email });
  }

  save(user: User): Promise<User | undefined> {
    return this.userRepository.save(user);
  }
}
