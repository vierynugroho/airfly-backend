import { jest } from '@jest/globals';
import { prisma } from '../../database/db.js';
import { AuthRepository } from '../auth.js';
import { Bcrypt } from '../../utils/bcrypt.js';

jest.mock('../../database/db.js');
jest.mock('../../utils/bcrypt.js');

describe('AuthRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      prisma.user.findFirst.mockResolvedValue(mockUser);

      const user = await AuthRepository.findByEmail('test@example.com');

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(user).toEqual(mockUser);
    });
  });

  describe('getUserStatusEnum', () => {
    it('should return UserStatus enum', async () => {
      const statusEnum = await AuthRepository.getUserStatusEnum();
      expect(statusEnum).toBeTruthy();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const hashedPassword = 'hashedPassword';
      Bcrypt.hash.mockResolvedValue(hashedPassword);

      await AuthRepository.update('John', 'Doe', '1234567890', 'password', 1);

      expect(Bcrypt.hash).toHaveBeenCalledWith('password');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          password: hashedPassword,
        },
      });
    });
  });

  describe('newUser', () => {
    it('should create a new user', async () => {
      const hashedPassword = 'hashedPassword';
      const mockUser = { id: 1, firstName: 'John', email: 'test@example.com' };

      Bcrypt.hash.mockResolvedValue(hashedPassword);
      prisma.user.create.mockResolvedValue(mockUser);

      const user = await AuthRepository.newUser(
        'John',
        'Doe',
        '1234567890',
        'test@example.com',
        'password'
      );

      expect(Bcrypt.hash).toHaveBeenCalledWith('password');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          email: 'test@example.com',
          password: hashedPassword,
          status: 'UNVERIFIED',
          role: 'BUYER',
        },
      });
      expect(user).toEqual(mockUser);
    });
  });

  describe('setSecretKey', () => {
    it('should set the secret key for a user', async () => {
      await AuthRepository.setSecretKey('secretToken', 1);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { secretKey: 'secretToken' },
      });
    });
  });

  describe('findUserById', () => {
    it('should find a user by ID', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      prisma.user.findFirst.mockResolvedValue(mockUser);

      const user = await AuthRepository.findUserById(1);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(user).toEqual(mockUser);
    });
  });

  describe('setOtp', () => {
    it('should set OTP for a user', async () => {
      await AuthRepository.setOtp('123456', 1);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { otpToken: '123456' },
      });
    });
  });

  describe('getUserBySecret', () => {
    it('should find a user by secret key', async () => {
      const mockUser = { id: 1, secretKey: 'secretToken' };
      prisma.user.findFirst.mockResolvedValue(mockUser);

      const user = await AuthRepository.getUserBySecret('secretToken');

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { secretKey: 'secretToken' },
      });
      expect(user).toEqual(mockUser);
    });
  });

  describe('setUserVerified', () => {
    it('should set user status to VERIFIED', async () => {
      await AuthRepository.setUserVerified(1);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'VERIFIED' },
      });
    });
  });

  describe('setNewPassword', () => {
    it('should set a new password for the user', async () => {
      const hashedPassword = 'hashedPassword';
      Bcrypt.hash.mockResolvedValue(hashedPassword);

      await AuthRepository.setNewPassword(1, 'newPassword');

      expect(Bcrypt.hash).toHaveBeenCalledWith('newPassword');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { password: hashedPassword },
      });
    });
  });
});
