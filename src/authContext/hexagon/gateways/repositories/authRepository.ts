import { User } from '../../entities/user.entity';

export interface AuthRepository {
  save(user: User): Promise<User>;
  getByEmail(email: string): Promise<User | undefined>;
  find(id: number): Promise<User | undefined>;
}
