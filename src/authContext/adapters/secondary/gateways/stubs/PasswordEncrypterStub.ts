import { PasswordEncrypter } from '../../../../hexagon/gateways/passwordEncrypter';

export class PasswordEncrypterStub implements PasswordEncrypter {
  private suffix = 'i am hashed';
  encrypt(plainTextPassword: string): Promise<string> {
    return Promise.resolve(plainTextPassword + this.suffix);
  }

  compare(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return Promise.resolve(plainTextPassword + this.suffix === hashedPassword);
  }
}
