import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { LocalAuthGuard } from "./local-auth.guard";
import { Public } from "./public.decorator";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @Public()
    async register(@Body() registerDto: RegisterDto) {
        const userId = await this.authService.register(registerDto);
        return {id: userId};
    }

    @Post('login')
    @Public()
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {
        return { 'token': this.authService.generateToken(req.user) };
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async  profile(@Request() req) {
        const { password, emailVerifiedAt, createdAt, updatedAt, ...profile }  = await this.authService.getUser(req.user.id);
        return profile;
    }
}