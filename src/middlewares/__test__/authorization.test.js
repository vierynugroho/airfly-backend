import { authorization } from '../authorization.js';
import { JWT } from '../../utils/jwt.js';
import { AuthRepository } from '../../repositories/auth.js';

jest.mock('../../utils/jwt.js');
jest.mock('../../repositories/auth.js');

describe('Authorization Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      headers: {},
      user: null,
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('Token Validation', () => {
    it('should throw error when no authorization header is present', async () => {
      const middleware = authorization(['ADMIN']);

      await middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          message: 'unauthorized',
        })
      );
    });

    it('should throw error when invalid token is provided', async () => {
      mockReq.headers.authorization = 'Bearer invalid_token';
      JWT.verify.mockReturnValue(false);
      const middleware = authorization(['ADMIN']);

      await middleware(mockReq, mockRes, mockNext);

      expect(JWT.verify).toHaveBeenCalledWith('invalid_token');
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 403,
          message: 'invalid token',
        })
      );
    });

    it('should validate token and proceed when valid token is provided', async () => {
      mockReq.headers.authorization = 'Bearer valid_token';
      const mockUser = {
        id: 1,
        role: 'ADMIN',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
      };

      JWT.verify.mockReturnValue({ id: '1' });
      AuthRepository.findUserById.mockResolvedValue(mockUser);

      const middleware = authorization(['ADMIN']);

      await middleware(mockReq, mockRes, mockNext);

      expect(JWT.verify).toHaveBeenCalledWith('valid_token');
      expect(AuthRepository.findUserById).toHaveBeenCalledWith(1);
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('Role Authorization', () => {
    it('should allow access when user has permitted role', async () => {
      mockReq.headers.authorization = 'Bearer valid_token';
      const mockUser = {
        id: 1,
        role: 'ADMIN',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
      };

      JWT.verify.mockReturnValue({ id: '1' });
      AuthRepository.findUserById.mockResolvedValue(mockUser);

      const middleware = authorization(['ADMIN', 'SUPER_ADMIN']);

      await middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockReq.user).toEqual(mockUser);
    });

    it('should deny access when user has unauthorized role', async () => {
      mockReq.headers.authorization = 'Bearer valid_token';
      const mockUser = {
        id: 1,
        role: 'USER',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
      };

      JWT.verify.mockReturnValue({ id: '1' });
      AuthRepository.findUserById.mockResolvedValue(mockUser);

      const middleware = authorization(['ADMIN']);

      await middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 403,
          message: 'forbidden, Go Back ! >:(',
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      mockReq.headers.authorization = 'Bearer valid_token';
      const dbError = new Error('Database error');

      JWT.verify.mockReturnValue({ id: '1' });
      AuthRepository.findUserById.mockRejectedValue(dbError);

      const middleware = authorization(['ADMIN']);

      await middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(dbError);
    });

    it('should handle JWT verification errors', async () => {
      mockReq.headers.authorization = 'Bearer valid_token';
      const jwtError = new Error('JWT verification failed');

      JWT.verify.mockImplementation(() => {
        throw jwtError;
      });

      const middleware = authorization(['ADMIN']);

      await middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(jwtError);
    });
  });

  describe('Token Extraction', () => {
    it('should correctly extract token from Bearer authorization header', async () => {
      mockReq.headers.authorization = 'Bearer test_token';
      const mockUser = {
        id: 1,
        role: 'ADMIN',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
      };

      JWT.verify.mockReturnValue({ id: '1' });
      AuthRepository.findUserById.mockResolvedValue(mockUser);

      const middleware = authorization(['ADMIN']);

      await middleware(mockReq, mockRes, mockNext);

      expect(JWT.verify).toHaveBeenCalledWith('test_token');
    });

    it('should handle malformed authorization header', async () => {
      mockReq.headers.authorization = 'malformed_token';
      const middleware = authorization(['ADMIN']);

      await middleware(mockReq, mockRes, mockNext);

      expect(JWT.verify).toHaveBeenCalledWith('malformed_token');
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
