import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../authService';
import { RegisterDto } from '../../../../hexagon/useCases/registration/dto/register.dto';
import { JwtAuthGuard } from '../guards/jwtAuthGuard';
import { LocalAuthGuard } from '../guards/localAuthGuard';
import { Public } from '../guards/publicDecorator';
import { Register } from '../../../../hexagon/useCases/registration/register';
import { EitherAsync } from 'purify-ts';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly registerUser: Register,
  ) {}

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.registerUser.handle(registerDto);

    return result
      .map((result) => {
        return result;
      })
      .ifLeft((error) => {
        throw new BadRequestException(error.message);
      });
  }

  @Post('login')
  @HttpCode(200)
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return { token: this.authService.generateToken(req.user) };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Request() req) {
    const { password, emailVerifiedAt, createdAt, updatedAt, ...profile } =
      await this.authService.getUser(req.user.id);
    return profile;
  }
}
