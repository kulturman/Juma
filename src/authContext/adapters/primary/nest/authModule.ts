import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUniqueConstraint } from '../../../../sharedKernel/adapaters/primary/nest/validation/IsUnique';
import { AuthService } from './authService';
import { AuthController } from './controllers/authController';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './guards/localAuthGuard';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwtAuthGuard';
import { APP_GUARD } from '@nestjs/core';
import { User } from '../../../entities/user.entity';

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
  ],
})
export class AuthModule {}
