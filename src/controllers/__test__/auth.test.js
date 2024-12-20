import { AuthController } from '../auth.js';
import { AuthService } from '../../services/auth.js';
import { UserService } from '../../services/user.js';

jest.mock('../../services/auth.js');
jest.mock('../../services/user.js');

describe('AuthController', () => {
  describe('login', () => {
    it('should successfully login and return a token', async () => {
      AuthService.auth.mockResolvedValueOnce('token_valid');
      const req = { body: { email: 'test@test.com', password: 'password' } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.login(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'login successfully' },
        data: { token: 'token_valid' },
      });
      expect(next).not.toHaveBeenCalled();
    });
    it('should handle login errors', async () => {
      const error = new Error('Authentication failed');
      AuthService.auth.mockRejectedValueOnce(error);
      const req = {
        body: { email: 'test@test.com', password: 'wrong_password' },
      };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.login(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      AuthService.register.mockResolvedValueOnce();
      const req = {
        body: {
          firstName: 'test',
          lastName: 'test',
          phone: '081234567890',
          email: 'test@test.com',
          password: 'password',
        },
      };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.register(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        meta: { statusCode: 201, message: "user has created, let's verify" },
      });
      expect(next).not.toHaveBeenCalled();
    });
    it('should handle register error', async () => {
      const mockError = new Error('Error Register');
      AuthService.register.mockRejectedValueOnce(mockError);
      const req = {
        body: {
          firstName: 'test',
          lastName: 'test',
          phone: '081234567890',
          email: 'test@test.com',
          password: 'password',
        },
      };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.register(req, res, next);
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('verify', () => {
    it('should successfully verify user with status VERIFIED', async () => {
      AuthService.verify.mockResolvedValueOnce('VERIFIED');
      const req = { body: { otp: '123456', email: 'test@test.com' } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.verify(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'user has been verified' },
      });
      expect(next).not.toHaveBeenCalled();
    });
    it('should successfully verify user with status OTP is valid', async () => {
      AuthService.verify.mockResolvedValueOnce('OTP is valid');
      const req = { body: { otp: '123456', email: 'test@test.com' } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.verify(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'OTP is valid' },
      });
      expect(next).not.toHaveBeenCalled();
    });
    it('should handle verify error', async () => {
      const mockError = new Error('Error Verify');
      AuthService.verify.mockRejectedValueOnce(mockError);
      const req = { body: { otp: '123456', email: 'test@test.com' } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.verify(req, res, next);
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset the password', async () => {
      AuthService.resetPassword.mockResolvedValueOnce();
      const req = {
        body: {
          email: 'test@test.com',
          otp: '123456',
          password: 'passwordbaru',
        },
      };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.resetPassword(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'Password has been reset' },
      });
      expect(next).not.toHaveBeenCalled();
    });
    it('should handle resetPassword error', async () => {
      const mockError = new Error('Error Reset Password');
      AuthService.resetPassword.mockRejectedValueOnce(mockError);
      const req = {
        body: {
          email: 'test@test.com',
          otp: '123456',
          password: 'passwordbaru',
        },
      };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.resetPassword(req, res, next);
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('sendResetOtp', () => {
    it('should successfully send reset OTP', async () => {
      AuthService.sendResetOtp.mockResolvedValueOnce();
      const req = { body: { email: 'test@test.com' } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.sendResetOtp(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'OTP has been sent' },
      });
      expect(next).not.toHaveBeenCalled();
    });
    it('should handle sendResetOtp error', async () => {
      const mockError = new Error('Error Send Reset Otp');
      AuthService.sendResetOtp.mockRejectedValueOnce(mockError);
      const req = { body: { email: 'test@test.com' } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.sendResetOtp(req, res, next);
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getUserLoggedIn', () => {
    it('should retrieve user data for a valid user ID', async () => {
      const userId = 123;
      const user = { id: userId, name: 'John Doe' };
      UserService.getByID.mockResolvedValueOnce(user);
      const req = { user: { id: userId } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.getUserLoggedIn(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'user logged in data retrieved successfully',
        },
        data: user,
      });
      expect(next).not.toHaveBeenCalled();
    });
    it('should handle errors from UserService.getByID', async () => {
      const userId = 123;
      const error = new Error('User not found');
      UserService.getByID.mockRejectedValueOnce(error);
      const req = { user: { id: userId } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.getUserLoggedIn(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
    it('should handle invalid user ID format (NaN)', async () => {
      const req = { user: { id: 'bukanAngka' } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.getUserLoggedIn(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('loginGoogle', () => {
    it('should successfully login with google', async () => {
      const mockAccessToken = 'tokenGoogle';
      const mockData = { id: '123', email: 'test@test.com', name: 'test' };
      AuthService.googleLogin.mockResolvedValueOnce(mockData);
      const req = { body: { access_token: mockAccessToken } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.loginGoogle(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'user logged in data retrieved successfully',
        },
        data: mockData,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle error when login with google', async () => {
      const mockAccessToken = 'tokenGoogle';
      const mockError = new Error('error google login');
      AuthService.googleLogin.mockRejectedValueOnce(mockError);
      const req = { body: { access_token: mockAccessToken } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      await AuthController.loginGoogle(req, res, next);
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
