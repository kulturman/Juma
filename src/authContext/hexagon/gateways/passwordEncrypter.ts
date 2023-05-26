export interface PasswordEncrypter {
  encrypt(plainTextPassword: string): Promise<string>;
}
