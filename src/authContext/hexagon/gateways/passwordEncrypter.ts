export interface PasswordEncrypter {
  encrypt(plainTextPassword: string): Promise<string>;
  compare(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}
