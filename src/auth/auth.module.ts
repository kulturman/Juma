import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { RegisterController } from "./register.controller";
import { UserRepository } from "./repositories/user.repository";

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository])],
    controllers: [RegisterController],
    providers: [AuthService]
})
export class AuthModule {

}