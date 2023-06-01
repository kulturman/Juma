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
import { RegisterDto } from '../../../../hexagon/dto/register.dto';
import { Register } from '../../../../hexagon/useCases/registration/register';
import { Login } from '../../../../hexagon/useCases/login/login';
import { AuthenticateDto } from '../../../../hexagon/dto/authenticateDto';
import { GetProfile } from '../../../../hexagon/useCases/profile/getProfile';
import { Public } from '../guards/publicDecorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly registerUser: Register,
    private readonly authenticateUser: Login,
    private readonly getProfile: GetProfile,
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
    return this.getProfile.handle(+req.user.id);
  }
}
