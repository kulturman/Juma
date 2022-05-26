import { IsEmail, IsNotEmpty } from "class-validator";
import { IsSame } from "src/helpers/validation/IsSame";

export class RegisterDto {
    @IsNotEmpty()
    fullname: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsSame('password')
    passwordConfirmation: string;
}