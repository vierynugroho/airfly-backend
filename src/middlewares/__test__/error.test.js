import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { MulterError } from 'multer';
import { errorMiddleware, ErrorHandler } from '../error.js';

describe('errorMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should handle PrismaClientKnownRequestError (code P2002)', () => {
    const err = new Prisma.PrismaClientKnownRequestError('Duplicate', {
      code: 'P2002',
    });

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        statusCode: 409,
        message: 'Duplicate field, constraint violation',
      },
    });
  });

  it('should handle PrismaClientKnownRequestError (code P2003)', () => {
    const err = new Prisma.PrismaClientKnownRequestError('Key Constraint', {
      code: 'P2003',
    });

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        statusCode: 409,
        message: 'Key Constraint',
        details: err.message,
      },
    });
  });

  it('should handle jwt.JsonWebTokenError', () => {
    const err = new jwt.JsonWebTokenError('Invalid token');

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        statusCode: 401,
        message: 'Invalid token, please re-login',
        details: 'Invalid token',
      },
    });
  });

  it('should handle jwt.TokenExpiredError', () => {
    const err = new jwt.TokenExpiredError('Token expired', new Date());

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        statusCode: 401,
        message: 'Token expired, please re-login',
        details: err.message,
      },
    });
  });

  it('should handle MulterError', () => {
    const err = new MulterError('LIMIT_FILE_SIZE', 'file');

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        statusCode: 400,
        title: 'LIMIT_FILE_SIZE: MulterError',
        message: 'MulterError - File too large',
        fields: 'file',
      },
    });
  });

  it('should handle ErrorHandler', () => {
    const err = new ErrorHandler(404, 'Resource not found');

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        statusCode: 404,
        message: 'Resource not found',
      },
    });
  });

  it('should handle unknown errors', () => {
    const err = new Error('Unexpected error');

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        statusCode: 500,
        message: 'something went wrong',
        details: err.message,
        sentry: 'undefined\n',
      },
    });
  });
});
