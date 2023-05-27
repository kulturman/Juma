import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from '../authService';
import { RegisterDto } from '../../../../hexagon/useCases/dto/register.dto';
import { Public } from '../guards/publicDecorator';
import { Register } from '../../../../hexagon/useCases/registration/register';
import { Login } from '../../../../hexagon/useCases/login/login';
import { AuthenticateDto } from '../../../../hexagon/useCases/dto/authenticateDto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly registerUser: Register,
    private readonly authenticateUser: Login,
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
  async login(@Body() authenticateDto: AuthenticateDto) {
    return this.authenticateUser.handle(authenticateDto);
  }

  @Get('profile')
  async profile(@Request() req) {
    const { password, emailVerifiedAt, createdAt, updatedAt, ...profile } =
      await this.authService.getUser(req.user.id);
    return profile;
  }
}
