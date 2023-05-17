import { CoreException } from './coreException';

export class BadRequestException extends CoreException {
  constructor(exceptionMessage: string) {
    super(exceptionMessage, 400, 'Resource not found');
  }
}
