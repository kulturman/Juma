import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './authService';
import { AuthController } from './controllers/authController';
import { LocalAuthGuard } from './guards/localAuthGuard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { User } from '../../../entities/user.entity';
import { DbAuthRepository } from '../../secondary/gateways/repositories/dbAuthRepository';
import { Register } from '../../../hexagon/useCases/registration/register';
import { AuthRepository } from '../../../hexagon/gateways/repositories/authRepository';
import { PasswordEncrypter } from '../../../hexagon/gateways/passwordEncrypter';
import { BcryptPasswordEncrypter } from '../../secondary/gateways/bcryptPasswordEncrypter';
import { Login } from '../../../hexagon/useCases/login/login';
import * as process from 'process';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [TypeOrmModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalAuthGuard,
    {
      provide: APP_GUARD,
      useClass: LocalAuthGuard,
    },
    {
      provide: 'AuthRepository',
      useClass: DbAuthRepository,
    },
    {
      provide: 'PasswordEncrypter',
      useClass: BcryptPasswordEncrypter,
    },
    {
      provide: Register,
      useFactory: (
        authRepository: AuthRepository,
        passwordEncrypter: PasswordEncrypter,
      ) => {
        return new Register(authRepository, passwordEncrypter);
      },
      inject: ['AuthRepository', 'PasswordEncrypter'],
    },
    {
      provide: Login,
      useFactory: (
        authRepository: AuthRepository,
        passwordEncrypter: PasswordEncrypter,
        jwtService: JwtService,
      ) => {
        return new Login(authRepository, passwordEncrypter, jwtService);
      },
      inject: ['AuthRepository', 'PasswordEncrypter', JwtService],
    },
  ],
})
export class AuthModule {}
