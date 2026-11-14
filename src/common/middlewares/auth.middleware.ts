import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UnauthorizedError, ForbiddenError } from '../errors/problem-details';

export interface AuthUser {
  userId: string;
  role: string;
  status: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      throw new UnauthorizedError('Missing authentication token');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      sub: string;
      role?: string;
      status?: string;
    };

    if (!decoded.sub) {
      throw new UnauthorizedError('Invalid token subject');
    }

    if (decoded.status === 'BANNED' || decoded.status === 'SUSPENDED') {
      throw new ForbiddenError(`Account is ${decoded.status.toLowerCase()}`);
    }

    req.user = {
      userId: decoded.sub,
      role: decoded.role || 'USER',
      status: decoded.status || 'ACTIVE',
    };

    next();
  } catch (err) {
    if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
      next(err);
    } else if (err instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Access token has expired'));
    } else if (err instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid access token'));
    } else {
      next(new UnauthorizedError('Authentication failed'));
    }
  }
}

export function requireActiveUser(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  if (req.user.status === 'QUARANTINED') {
    return next(new ForbiddenError('Account is quarantined due to safety reports. Feature disabled until review.'));
  }

  if (req.user.status !== 'ACTIVE') {
    return next(new ForbiddenError(`Account status (${req.user.status}) does not permit this action`));
  }

  next();
}
