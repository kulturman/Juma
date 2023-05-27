import { AuthRepository } from '../../gateways/repositories/authRepository';
import { RegisterDto } from './dto/register.dto';
import { User } from '../../../entities/user.entity';
import { PasswordEncrypter } from '../../gateways/passwordEncrypter';
import { EitherAsync, Left, Right } from 'purify-ts';

export class Register {
  constructor(
    private readonly authRepository: AuthRepository,
    private passwordEncrypter: PasswordEncrypter,
  ) {}

  handle(registerDto: RegisterDto): EitherAsync<Error, { id: string }> {
    return EitherAsync(async ({ liftEither, throwE }) => {
      const existingUser = await this.authRepository.getByEmail(
        registerDto.email,
      );
      if (existingUser) {
        return liftEither(Left(throwE(new Error('Email is already used'))));
      }

      const user = await this.authRepository.save(
        User.register({
          ...registerDto,
          password: await this.passwordEncrypter.encrypt(registerDto.password),
        }),
      );

      return liftEither(
        Right({
          id: user.id.toString(),
        }),
      );
    });
  }
}
