import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsSame } from '../../../../../sharedKernel/hexagon/validation/IsSame';
import { IsUnique } from '../../../../../sharedKernel/hexagon/validation/IsUnique';

export class RegisterDto {
  @IsNotEmpty()
  fullname: string;

  @IsEmail()
  //@IsUnique({ table: 'users' })
  email: string;

  @IsNotEmpty()
  password: string;

  @IsSame('password')
  passwordConfirmation: string;
}
