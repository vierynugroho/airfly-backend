import jwt from 'jsonwebtoken';
import { JWT } from '../jwt.js';

describe('JWT', () => {
  const mockSecret = 'mock_secret';
  const mockId = '12345';
  const mockToken = 'mock_token';
  const mockDecoded = { id: mockId };

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.JWT_SECRET = mockSecret;
  });

  describe('sign', () => {
    it('should sign a token with the correct payload and options', () => {
      jest.spyOn(jwt, 'sign').mockReturnValue(mockToken);

      const result = JWT.sign(mockId);

      expect(jwt.sign).toHaveBeenCalledWith({ id: mockId }, mockSecret, {
        algorithm: 'HS256',
        expiresIn: '24h',
      });
      expect(result).toBe(mockToken);
    });
  });

  describe('verify', () => {
    it('should verify a token and return the decoded payload', () => {
      jest.spyOn(jwt, 'verify').mockReturnValue(mockDecoded);

      const result = JWT.verify(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockSecret);
      expect(result).toEqual(mockDecoded);
    });

    it('should use default secret if JWT_SECRET is not set', () => {
      delete process.env.JWT_SECRET;

      jest.spyOn(jwt, 'verify').mockReturnValue(mockDecoded);

      const result = JWT.verify(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'secret_key');
      expect(result).toEqual(mockDecoded);
    });
  });
});
