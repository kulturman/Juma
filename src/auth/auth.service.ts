import { Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { User } from "./entities/user.entity";
import { UserRepository } from "./repositories/UserRepository";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userRepository: UserRepository) {}

    async register(registerDto: RegisterDto) {
        const user = new User();
        user.email = registerDto.email;
        user.fullname = registerDto.fullname;
        user.password = await bcrypt.hash(registerDto.password, 10);
        await this.userRepository.save(user);
        return user.id.toString();
    }
}