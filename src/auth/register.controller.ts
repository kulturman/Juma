import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";

@Controller('auth')
export class RegisterController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        const userId = await this.authService.register(registerDto);
        return {id: userId};
    }
}