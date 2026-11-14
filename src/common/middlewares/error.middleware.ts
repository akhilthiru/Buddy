import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/problem-details';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const instance = req.originalUrl || req.url;

  if (err instanceof AppError) {
    res
      .status(err.status)
      .header('Content-Type', 'application/problem+json')
      .json(err.toProblemDetails(instance));
    return;
  }

  if (err instanceof ZodError) {
    const invalidParams = err.issues.map((issue) => ({
      name: issue.path.join('.'),
      reason: issue.message,
    }));

    res
      .status(400)
      .header('Content-Type', 'application/problem+json')
      .json({
        type: 'https://flatmate.in/errors/validation-failed',
        title: 'Validation Error',
        status: 400,
        detail: 'The request payload failed schema validation.',
        instance,
        invalidParams,
      });
    return;
  }

  // Fallback for unhandled internal exceptions
  console.error('[Unhandled Server Exception]:', err);
  res
    .status(500)
    .header('Content-Type', 'application/problem+json')
    .json({
      type: 'https://flatmate.in/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected internal server error occurred.',
      instance,
    });
}
