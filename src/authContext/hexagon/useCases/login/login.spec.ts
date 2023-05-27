import { AuthRepositoryStub } from '../../../adapters/secondary/gateways/stubs/AuthRepositoryStub';
import { PasswordEncrypterStub } from '../../../adapters/secondary/gateways/stubs/PasswordEncrypterStub';
import { Login } from './login';
import { NotFoundException } from '../../../../sharedKernel/hexagon/exceptions/notFoundException';
import { JwtService } from '@nestjs/jwt';

describe('Authentication', () => {
  let authRepository: AuthRepositoryStub;
  let passwordEncrypter: PasswordEncrypterStub;
  let loginCommandHandler: Login;

  beforeEach(() => {
    authRepository = new AuthRepositoryStub();
    passwordEncrypter = new PasswordEncrypterStub();
    loginCommandHandler = new Login(
      authRepository,
      passwordEncrypter,
      new JwtService(),
    );
  });

  it('should fail authentication if email not found', async () => {
    const result = await loginCommandHandler.handle({
      email: 'arnaudbakyono@gmail.com',
      password: 'agathe',
    });

    expect(result.isLeft()).toBeTruthy();

    result.ifLeft((error) => {
      expect(error instanceof NotFoundException).toBeTruthy();
    });
  });

  it('should authenticate if password is not correct', async () => {
    authRepository.addUser({
      email: 'arnaudbakyono@gmail.com',
      fullname: 'Arnaud B',
      password: await passwordEncrypter.encrypt('arnaud'),
    });

    const result = await loginCommandHandler.handle({
      email: 'arnaudbakyono@gmail.com',
      password: 'agathe',
    });

    expect(result.isLeft()).toBeTruthy();

    result.ifLeft((error) => {
      expect(error instanceof NotFoundException).toBeTruthy();
    });
  });

  it('should authenticate if email exists', async () => {
    authRepository.addUser({
      email: 'arnaudbakyono@gmail.com',
      fullname: 'Arnaud B',
      password: await passwordEncrypter.encrypt('arnaud'),
    });

    const result = await loginCommandHandler.handle({
      email: 'arnaudbakyono@gmail.com',
      password: 'arnaud',
    });

    expect(result.isRight()).toBeTruthy();

    result.ifRight((result) => {
      expect(result).toMatchObject({
        token: expect.any(String),
      });
    });
  });
});
