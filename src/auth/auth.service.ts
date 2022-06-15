import { Injectable, NotFoundException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { User } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { UserJwtPayload } from "./user-jwt.payload";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userRepository: UserRepository, private jwtService: JwtService) {}

    async register(registerDto: RegisterDto) {
        const user = new User();
        user.email = registerDto.email;
        user.fullname = registerDto.fullname;
        user.setPassword(registerDto.password);
        await this.userRepository.save(user);
        return user.id.toString();
    }

    async getUser(id: string) {
       const user = await this.userRepository.findOne({ id: +id });
       if (!user) {
           throw new NotFoundException();
       }
       return user;
    }

    async authenticateUser(email: string, password: string) {
        const user = await this.userRepository.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            return new UserJwtPayload(user.id.toString(), user.email);    
        }

        return null;
    }

    generateToken(payload: UserJwtPayload) {
        return this.jwtService.sign({...payload}, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h'
        });
    }
}