export class CoreException extends Error {
  constructor(
    private readonly exceptionMessage: string,
    private readonly statusCode: number,
    private readonly label: string,
  ) {
    super(exceptionMessage);
    this.name = this.constructor.name;
    this.label = label;
    this.statusCode = statusCode;
    this.exceptionMessage = exceptionMessage;
  }

  getStatusCode() {
    return this.statusCode;
  }

  getLabel() {
    return this.label;
  }
}
