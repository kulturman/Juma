import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsSame } from '../../helpers/validation/IsSame';
import { IsUnique } from '../../helpers/validation/IsUnique';

export class RegisterDto {
  @IsNotEmpty()
  fullname: string;

  @IsEmail()
  @IsUnique({ table: 'users' })
  email: string;

  @IsNotEmpty()
  password: string;

  @IsSame('password')
  passwordConfirmation: string;
}
