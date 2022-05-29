import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LocalAuthGuard } from "./local-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        const userId = await this.authService.register(registerDto);
        return {id: userId};
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {
        return { 'token': this.authService.generateToken(req.user) };
    }
}