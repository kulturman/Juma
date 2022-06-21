import { ForbiddenException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function preventDirectoryTraversalMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //Since parameters are not parsed yet I just check the URL for .. (directory traversal)
  if (req.originalUrl.includes('..')) {
    throw new ForbiddenException(
      'Nice try, cannot let you explore directories like that',
    );
  }
  next();
}
