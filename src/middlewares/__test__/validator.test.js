import validationMiddleware from '../validator.js';
import { ErrorHandler } from '../error.js';

describe('validationMiddleware', () => {
  let req, res, next, schema;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = jest.fn();
    schema = {
      validateAsync: jest.fn(),
    };
  });

  it('should call next without error when validation is successful', async () => {
    req.body = { name: 'Test' };
    schema.validateAsync.mockResolvedValue(req.body);

    const middleware = validationMiddleware(schema);
    await middleware(req, res, next);

    expect(schema.validateAsync).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });

  it('should call next with ErrorHandler for Joi validation error', async () => {
    const joiError = new Error('Validation failed');
    joiError.isJoi = true;
    schema.validateAsync.mockRejectedValue(joiError);

    req.body = { name: '' }; // Invalid data

    const middleware = validationMiddleware(schema);
    await middleware(req, res, next);

    expect(schema.validateAsync).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    expect(next.mock.calls[0][0]).toBeInstanceOf(ErrorHandler);
    expect(next.mock.calls[0][0].statusCode).toBe(422);
    expect(next.mock.calls[0][0].message).toBe('Validation failed');
  });

  it('should not handle non-Joi errors', async () => {
    const nonJoiError = new Error('Unexpected error');
    schema.validateAsync.mockImplementation(() => nonJoiError);

    const middleware = validationMiddleware(schema);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
