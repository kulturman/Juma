import { AuthRepository } from '../../../../hexagon/gateways/repositories/authRepository';
import { User } from '../../../../hexagon/entities/user.entity';

export class AuthRepositoryStub implements AuthRepository {
  private users: Array<User> = [];

  addUser(user: Partial<User>): User {
    const createdUser = {
      email: user.email,
      password: user.password,
      fullname: user.fullname,
      id: this.users.length + 1,
      emailVerifiedAt: new Date(),
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    this.users.push(createdUser);

    return createdUser;
  }
  find(id: number): Promise<User | undefined> {
    const user = this.users.find((u) => u.id === id);
    return Promise.resolve(user);
  }

  getByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((u) => u.email === email);
    return Promise.resolve(user);
  }

  save(user: User): Promise<User> {
    user.id = this.users.length + 1;
    this.users.push(user);
    return Promise.resolve(user);
  }
}
