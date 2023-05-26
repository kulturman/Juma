import { AuthRepository } from '../../gateways/repositories/authRepository';
import { User } from '../../../entities/user.entity';
import { PasswordEncrypter } from '../../gateways/passwordEncrypter';
import { Register } from './register';
import { timestamp } from 'rxjs';

describe('Register user', () => {
  let authRepository: AuthRepositoryStub;
  let passwordEncrypter: PasswordEncrypterStub;
  let registerUser: Register;

  const registerUserDto = {
    fullname: 'UCHIHA Itachi',
    email: 'itachi@konaha.com',
    password: 'Susanoo',
    passwordConfirmation: 'Susanoo',
  };

  beforeEach(() => {
    authRepository = new AuthRepositoryStub();
    passwordEncrypter = new PasswordEncrypterStub();
    registerUser = new Register(authRepository, passwordEncrypter);
  });

  it('should register user', async () => {
    const result = await registerUser.handle(registerUserDto);

    result.map(async (result) => {
      const user = await authRepository.find(+result.id);

      expect(user).toMatchObject({
        fullname: registerUserDto.fullname,
        email: registerUserDto.email,
        id: +result.id,
        password: await passwordEncrypter.encrypt(registerUserDto.password),
      });
    });
  });

  it('should not allow user to register if email is already used', async () => {
    authRepository.addUser({
      fullname: registerUserDto.fullname,
      email: registerUserDto.email,
      password: '',
    });

    const result = await registerUser.handle(registerUserDto);

    result.ifLeft((error) => {
      expect(error.message).toContain('Email is already used');
    });
  });
});

export class PasswordEncrypterStub implements PasswordEncrypter {
  encrypt(plainTextPassword: string): Promise<string> {
    return Promise.resolve(plainTextPassword + 'i am hashed');
  }
}
export class AuthRepositoryStub implements AuthRepository {
  private users: Array<User> = [];

  addUser(user: Partial<User>) {
    this.users.push({
      email: user.email,
      password: user.password,
      fullname: user.fullname,
      id: this.users.length + 1,
      emailVerifiedAt: new Date(),
      updatedAt: new Date(),
      createdAt: new Date(),
    });
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
