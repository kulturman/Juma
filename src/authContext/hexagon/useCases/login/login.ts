import { EitherAsync, Left, Right } from 'purify-ts';
import { NotFoundException } from '../../../../sharedKernel/hexagon/exceptions/notFoundException';
import { JwtService } from '@nestjs/jwt';
import { PasswordEncrypter } from '../../gateways/passwordEncrypter';
import { AuthRepository } from '../../gateways/repositories/authRepository';

export class Login {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordEncrypter: PasswordEncrypter,
    private jwtService: JwtService,
  ) {}

  handle(command: LoginCommand): EitherAsync<Error, AuthenticationResponse> {
    return EitherAsync(async ({ liftEither, throwE }) => {
      const user = await this.authRepository.getByEmail(command.email);

      if (
        user === undefined ||
        !(await this.passwordEncrypter.compare(command.password, user.password))
      ) {
        return liftEither(
          Left(
            throwE(new NotFoundException('User name or password is incorrect')),
          ),
        );
      }

      return liftEither(
        Right({
          token: this.jwtService.sign(
            { id: user.id, email: user.email },
            {
              secret: process.env.JWT_SECRET,
              expiresIn: '1h',
            },
          ),
        }),
      );
    });
  }
}

export interface LoginCommand {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
}
