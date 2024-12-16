import { AuthService } from '../../services/auth.js';
import { AuthRepository } from '../../repositories/auth.js';
import { JWT } from '../../utils/jwt.js';
import { Bcrypt } from '../../utils/bcrypt.js';
import { sendOTP } from '../../utils/email.js';
import { UserStatus } from '@prisma/client';
import { generate, validate } from '../../utils/otp.js';
import { ErrorHandler } from '../../middlewares/error.js';

jest.mock('../../repositories/auth.js');
jest.mock('../../utils/jwt.js');
jest.mock('../../utils/bcrypt.js');
jest.mock('../../utils/email.js');
jest.mock('../../utils/otp.js');

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('Auth', () => {
    it('should throw an error if user is not registered', async () => {
      AuthRepository.findByEmail.mockResolvedValue(null);

      await expect(
        AuthService.auth('test@example.com', 'password')
      ).rejects.toThrow(new ErrorHandler(404, 'user is not registered'));
    });

    it('should throw an error if password is incorrect', async () => {
      const user = { id: 1, password: 'hashedpassword', status: 'VERIFIED' };
      AuthRepository.findByEmail.mockResolvedValue(user);
      Bcrypt.compare.mockResolvedValue(false);

      await expect(
        AuthService.auth('test@example.com', 'password')
      ).rejects.toThrow(new ErrorHandler(401, 'wrong credential'));
    });

    it('should throw an error if user is not verified', async () => {
      const user = { id: 1, password: 'hashedpassword', status: 'UNVERIFIED' };
      AuthRepository.findByEmail.mockResolvedValue(user);
      Bcrypt.compare.mockResolvedValue(true);
      AuthRepository.getUserStatusEnum.mockResolvedValue(UserStatus);

      await expect(
        AuthService.auth('test@example.com', 'password')
      ).rejects.toThrow(new ErrorHandler(403, 'user not verified'));
    });

    it('should return a token if authentication is successful', async () => {
      const user = { id: 1, password: 'hashedpassword', status: 'VERIFIED' };
      AuthRepository.findByEmail.mockResolvedValue(user);
      Bcrypt.compare.mockResolvedValue(true);
      AuthRepository.getUserStatusEnum.mockResolvedValue(UserStatus);
      JWT.sign.mockReturnValue('mockedToken');

      const token = await AuthService.auth('test@example.com', 'password');
      expect(token).toBe('mockedToken');
    });
  });

  describe('register', () => {
    it('should throw an error if email is already registered and verified', async () => {
      const user = { id: 1, status: 'VERIFIED' };
      AuthRepository.findByEmail.mockResolvedValue(user);
      AuthRepository.getUserStatusEnum.mockResolvedValue(UserStatus);

      await expect(
        AuthService.register(
          'John',
          'Doe',
          '123456789',
          'test@example.com',
          'password'
        )
      ).rejects.toThrow(new ErrorHandler(409, 'email has registered'));
    });

    it('should update an existing unverified user', async () => {
      const user = { id: 1, status: 'UNVERIFIED' };
      AuthRepository.findByEmail.mockResolvedValue(user);
      AuthRepository.getUserStatusEnum.mockResolvedValue(UserStatus);
      AuthRepository.update.mockResolvedValue();
      generate.mockReturnValue('mockedOTP');
      sendOTP.mockResolvedValue();

      await AuthService.register(
        'John',
        'Doe',
        '123456789',
        'test@example.com',
        'password'
      );

      expect(AuthRepository.update).toHaveBeenCalledWith(
        'John',
        'Doe',
        '123456789',
        'password',
        user.id
      );
      expect(sendOTP).toHaveBeenCalledWith(
        'mockedOTP',
        'test@example.com',
        'John Doe'
      );
    });

    it('should create a new user and send OTP', async () => {
      AuthRepository.findByEmail.mockResolvedValue(null);
      AuthRepository.newUser.mockResolvedValue({ id: 1 });
      generate.mockReturnValue('mockedOTP');
      sendOTP.mockResolvedValue();

      await AuthService.register(
        'John',
        'Doe',
        '123456789',
        'test@example.com',
        'password'
      );

      expect(AuthRepository.newUser).toHaveBeenCalledWith(
        'John',
        'Doe',
        '123456789',
        'test@example.com',
        'password'
      );
      expect(sendOTP).toHaveBeenCalledWith(
        'mockedOTP',
        'test@example.com',
        'John Doe'
      );
    });
  });

  describe('verify', () => {
    it('should throw an error if user is not registered', async () => {
      AuthRepository.findByEmail.mockResolvedValue(null);

      await expect(
        AuthService.verify('mockedOTP', 'test@example.com')
      ).rejects.toThrow(new ErrorHandler(404, 'User not registered'));
    });

    it('should throw an error if OTP is invalid', async () => {
      const user = { id: 1, status: 'UNVERIFIED' };
      AuthRepository.findByEmail.mockResolvedValue(user);
      validate.mockReturnValue(null);

      await expect(
        AuthService.verify('mockedOTP', 'test@example.com')
      ).rejects.toThrow(new ErrorHandler(400, 'Invalid OTP'));
    });

    it('should verify the user if OTP is valid', async () => {
      const user = { id: 1, status: 'UNVERIFIED' };
      AuthRepository.findByEmail.mockResolvedValue(user);
      validate.mockReturnValue(true);
      AuthRepository.setUserVerified.mockResolvedValue();

      const result = await AuthService.verify('mockedOTP', 'test@example.com');

      expect(AuthRepository.setUserVerified).toHaveBeenCalledWith(1);
      expect(result).toBe('VERIFIED');
    });

    it('should verify the OTP is valid', async () => {
      const user = { id: 1, status: 'VERIFIED' };
      AuthRepository.findByEmail.mockResolvedValue(user);
      validate.mockReturnValue(true);
      const result = await AuthService.verify('mockedOTP', 'test@example.com');
      expect(result).toBe('VALIDATE');
    });
  });

  describe('sendResetOtp', () => {
    it('should throw an error if user is not found', async () => {
      AuthRepository.findByEmail.mockResolvedValue(null);

      await expect(
        AuthService.sendResetOtp('test@example.com')
      ).rejects.toThrow(new ErrorHandler(404, 'User not found'));
    });

    it('should generate and send OTP to the user', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      AuthRepository.findByEmail.mockResolvedValue(user);
      generate.mockReturnValue('mockedOTP');
      AuthRepository.setOtp.mockResolvedValue();
      sendOTP.mockResolvedValue();

      await AuthService.sendResetOtp('test@example.com');

      expect(generate).toHaveBeenCalledWith(
        Buffer.from(user.id.toString()).toString('base64')
      );
      expect(AuthRepository.setOtp).toHaveBeenCalledWith('mockedOTP', user.id);
      expect(sendOTP).toHaveBeenCalledWith(
        'mockedOTP',
        'test@example.com',
        'John Doe'
      );
    });
  });

  describe('resetPassword', () => {
    it('should throw an error if OTP is invalid', async () => {
      const user = { id: 1, otpToken: 'mockedOTP' };
      AuthRepository.findByEmail.mockResolvedValue(user);
      validate.mockReturnValue(null);

      await expect(
        AuthService.resetPassword(
          'test@example.com',
          'invalidOTP',
          'newPassword'
        )
      ).rejects.toThrow(new ErrorHandler(400, 'Invalid OTP Code 1'));
    });

    it('should throw an error if OTP does not match', async () => {
      const user = { id: 1, otpToken: 'mockedOTP' };
      AuthRepository.findByEmail.mockResolvedValue(user);
      validate.mockReturnValue(true);

      await expect(
        AuthService.resetPassword('test@example.com', 'wrongOTP', 'newPassword')
      ).rejects.toThrow(new ErrorHandler(400, 'Invalid OTP Code'));
    });

    it('should reset the user password if OTP is valid', async () => {
      const user = { id: 1, otpToken: 'mockedOTP' };
      AuthRepository.findByEmail.mockResolvedValue(user);
      validate.mockReturnValue(true);
      AuthRepository.setNewPassword.mockResolvedValue();

      await AuthService.resetPassword(
        'test@example.com',
        'mockedOTP',
        'newPassword'
      );

      expect(AuthRepository.setNewPassword).toHaveBeenCalledWith(
        user.id,
        'newPassword'
      );
    });
  });

  describe('googleLogin', () => {
    it('should create a new user if not found and return a token', async () => {
      const googleResponse = {
        email: 'test@example.com',
        given_name: 'John',
        family_name: 'Doe',
      };
      AuthRepository.googleLogin.mockResolvedValue(googleResponse);
      AuthRepository.findByEmail.mockResolvedValue(null);
      AuthRepository.newGoogleUser.mockResolvedValue({ id: 1 });
      JWT.sign.mockReturnValue('mockedToken');

      const result = await AuthService.googleLogin('mockAccessToken');

      expect(AuthRepository.googleLogin).toHaveBeenCalledWith(
        'mockAccessToken'
      );
      expect(AuthRepository.newGoogleUser).toHaveBeenCalledWith(
        'John',
        'Doe',
        '',
        'test@example.com',
        ''
      );
      expect(result).toEqual({ user: { id: 1 }, token: 'mockedToken' });
    });

    it('should return a token for an existing user', async () => {
      const googleResponse = {
        email: 'test@example.com',
        given_name: 'John',
        family_name: 'Doe',
      };
      const user = {
        id: 1,
        password: null,
        secretKey: null,
        otpToken: null,
        phone: null,
      };
      AuthRepository.googleLogin.mockResolvedValue(googleResponse);
      AuthRepository.findByEmail.mockResolvedValue(user);
      JWT.sign.mockReturnValue('mockedToken');

      const result = await AuthService.googleLogin('mockAccessToken');

      expect(AuthRepository.googleLogin).toHaveBeenCalledWith(
        'mockAccessToken'
      );
      expect(result).toEqual({ user, token: 'mockedToken' });
    });
  });
});
