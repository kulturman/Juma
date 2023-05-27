import { Register } from './register';
import { AuthRepositoryStub } from '../../../adapters/secondary/gateways/stubs/AuthRepositoryStub';
import { PasswordEncrypterStub } from '../../../adapters/secondary/gateways/stubs/PasswordEncrypterStub';

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
      password: '123456',
    });

    const result = await registerUser.handle(registerUserDto);

    result.ifLeft((error) => {
      expect(error.message).toContain('Email is already used');
    });
  });
});
