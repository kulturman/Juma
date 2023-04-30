import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { CoreException } from 'src/shared/hexagon/exceptions/coreException';

@Catch(CoreException)
export class CoreExceptionFilter implements ExceptionFilter {
  catch(exception: CoreException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatusCode();

    return response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.getLabel(),
    });
  }
}
