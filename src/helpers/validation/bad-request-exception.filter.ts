import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, ValidationError } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errors = <{ message: [ValidationError] }>exception.getResponse();
    
    const data = errors.message.map(error => {
      return {
        field: error.property,
        constraints: Object.keys(error.constraints).map((key, index) => {
          return {
            constraint: key,
            message: error.constraints[key]
          };
        }),
        value: error.value
      }
    })

    response
      .status(status)
      .json({
        errors: data
      });
  }
}