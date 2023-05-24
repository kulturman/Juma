import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../authService';
import { RegisterDto } from '../../../../dto/register.dto';
import { JwtAuthGuard } from '../guards/jwtAuthGuard';
import { LocalAuthGuard } from '../guards/localAuthGuard';
import { Public } from '../guards/publicDecorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    const userId = await this.authService.register(registerDto);
    return { id: userId };
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
