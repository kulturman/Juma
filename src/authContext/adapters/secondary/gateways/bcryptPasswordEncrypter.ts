import { PasswordEncrypter } from '../../../hexagon/gateways/passwordEncrypter';
import * as bcrypt from 'bcrypt';

export class BcryptPasswordEncrypter implements PasswordEncrypter {
  async encrypt(plainTextPassword: string): Promise<string> {
    return bcrypt.hash(plainTextPassword);
  }

  compare(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
