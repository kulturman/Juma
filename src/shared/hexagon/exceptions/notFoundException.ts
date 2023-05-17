import { CoreException } from './coreException';

export class NotFoundException extends CoreException {
  constructor(exceptionMessage: string) {
    super(exceptionMessage, 404, 'Resource not found');
  }
}
