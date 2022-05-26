import { IsEmail, IsNotEmpty } from "class-validator";
import { IsSame } from "src/helpers/validation/IsSame";
import { IsUnique } from "src/helpers/validation/IsUnique";

export class RegisterDto {
    @IsNotEmpty()
    fullname: string;

    @IsEmail()
    @IsUnique({'table': 'users'})
    email: string;

    @IsNotEmpty()
    password: string;

    @IsSame('password')
    passwordConfirmation: string;
}