import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsSame } from '../../sharedKernel/adapaters/primary/nest/validation/IsSame';
import { IsUnique } from '../../sharedKernel/adapaters/primary/nest/validation/IsUnique';

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
