import { CoreException } from './coreException';

export class LogicException extends CoreException {
  constructor(exceptionMessage: string) {
    super(exceptionMessage, 500, 'An error has occured');
  }
}
