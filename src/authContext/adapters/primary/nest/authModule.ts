import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUniqueConstraint } from '../../../../sharedKernel/hexagon/validation/IsUnique';
import { AuthService } from './authService';
import { AuthController } from './controllers/authController';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './guards/localAuthGuard';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwtAuthGuard';
import { APP_GUARD } from '@nestjs/core';
import { User } from '../../../entities/user.entity';
import { DbAuthRepository } from '../../secondary/gateways/repositories/dbAuthRepository';
import { Register } from '../../../hexagon/useCases/registration/register';
import { AuthRepository } from '../../../hexagon/gateways/repositories/authRepository';
import { PasswordEncrypter } from '../../../hexagon/gateways/passwordEncrypter';
import { BcryptPasswordEncrypter } from '../../secondary/gateways/bcryptPasswordEncrypter';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    IsUniqueConstraint,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
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
  ],
})
export class AuthModule {}
