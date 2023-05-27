import { PasswordEncrypter } from '../../../hexagon/gateways/passwordEncrypter';
import * as bcrypt from 'bcrypt';

export class BcryptPasswordEncrypter implements PasswordEncrypter {
  async encrypt(plainTextPassword: string): Promise<string> {
    return bcrypt.hash(plainTextPassword);
  }
}
