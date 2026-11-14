export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  invalidParams?: Array<{
    name: string;
    reason: string;
  }>;
}

export class AppError extends Error {
  public readonly status: number;
  public readonly type: string;
  public readonly title: string;
  public readonly detail: string;
  public readonly invalidParams?: Array<{ name: string; reason: string }>;

  constructor(status: number, title: string, detail: string, type?: string, invalidParams?: Array<{ name: string; reason: string }>) {
    super(detail);
    this.name = 'AppError';
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.type = type || `https://flatmate.in/errors/${title.toLowerCase().replace(/\s+/g, '-')}`;
    this.invalidParams = invalidParams;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toProblemDetails(instance?: string): ProblemDetails {
    return {
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.detail,
      ...(instance && { instance }),
      ...(this.invalidParams && { invalidParams: this.invalidParams }),
    };
  }
}

export class BadRequestError extends AppError {
  constructor(detail = 'Bad request', invalidParams?: Array<{ name: string; reason: string }>) {
    super(400, 'Bad Request', detail, 'https://flatmate.in/errors/bad-request', invalidParams);
  }
}

export class ValidationError extends AppError {
  constructor(detail = 'Validation failed', invalidParams?: Array<{ name: string; reason: string }>) {
    super(400, 'Validation Error', detail, 'https://flatmate.in/errors/validation-failed', invalidParams);
  }
}

export class UnauthorizedError extends AppError {
  constructor(detail = 'Authentication credentials are invalid or missing') {
    super(401, 'Unauthorized', detail, 'https://flatmate.in/errors/unauthorized');
  }
}

export class ForbiddenError extends AppError {
  constructor(detail = 'You do not have permission to access this resource') {
    super(403, 'Forbidden', detail, 'https://flatmate.in/errors/forbidden');
  }
}

export class NotFoundError extends AppError {
  constructor(detail = 'Requested resource was not found') {
    super(404, 'Not Found', detail, 'https://flatmate.in/errors/not-found');
  }
}

export class ConflictError extends AppError {
  constructor(detail = 'Resource conflict detected') {
    super(409, 'Conflict', detail, 'https://flatmate.in/errors/conflict');
  }
}

export class AccountLockedError extends AppError {
  constructor(detail = 'Account locked due to excessive failed attempts') {
    super(423, 'Locked', detail, 'https://flatmate.in/errors/account-locked');
  }
}

export class RateLimitError extends AppError {
  constructor(detail = 'Too many requests. Please slow down.') {
    super(429, 'Too Many Requests', detail, 'https://flatmate.in/errors/too-many-requests');
  }
}

export class InternalServerError extends AppError {
  constructor(detail = 'An unexpected internal server error occurred') {
    super(500, 'Internal Server Error', detail, 'https://flatmate.in/errors/internal-error');
  }
}
