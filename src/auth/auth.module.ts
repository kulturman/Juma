import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IsUniqueConstraint } from "src/helpers/validation/IsUnique";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserRepository } from "./repositories/user.repository";
import { LocalStrategy } from "./strategies/local.strategy";
import { LocalAuthGuard } from "./local-auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository]),
        JwtModule.register({})
    ],
    controllers: [AuthController],
    providers: [
        AuthService, IsUniqueConstraint,
        LocalStrategy, LocalAuthGuard,
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        }
    ]
})
export class AuthModule {

}