import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsSame } from '../../sharedKernel/adapters/primary/nest/validation/IsSame';
import { IsUnique } from '../../sharedKernel/adapters/primary/nest/validation/IsUnique';

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
