import { UserService } from '../user.js';
import { UserRepository } from '../../repositories/user.js';

jest.mock('../../repositories/user.js');

describe('UserService', () => {
  describe('getAll', () => {
    it('should return all users with total count', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          password: 'secret',
          otpToken: '1234',
          secretKey: 'key',
        },
      ];
      const mockFilter = { active: true };
      const mockPagination = { limit: 10, offset: 0 };

      UserRepository.findMany.mockResolvedValue(mockUsers);
      UserRepository.count.mockResolvedValue(1);

      const result = await UserService.getAll(mockPagination, mockFilter);

      expect(UserRepository.findMany).toHaveBeenCalledWith(
        mockPagination,
        mockFilter
      );
      expect(UserRepository.count).toHaveBeenCalledWith(mockFilter);
      expect(result).toEqual({
        users: [{ id: 1, name: 'John Doe' }],
        totalUsers: 1,
      });
    });
  });

  describe('getByID', () => {
    it('should return user by ID', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        password: 'secret',
        otpToken: '1234',
        secretKey: 'key',
      };

      UserRepository.findByID.mockResolvedValue(mockUser);

      const result = await UserService.getByID(1);

      expect(UserRepository.findByID).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, name: 'John Doe' });
    });

    it('should throw an error if user is not found', async () => {
      UserRepository.findByID.mockResolvedValue(null);

      await expect(UserService.getByID(1)).rejects.toThrow('user is not found');
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        password: 'secret',
        otpToken: '1234',
        secretKey: 'key',
      };
      const mockUpdatedData = { name: 'Jane Doe' };
      const mockUpdatedUser = { id: 1, name: 'Jane Doe' };

      UserRepository.findByID.mockResolvedValue(mockUser);
      UserRepository.update.mockResolvedValue(mockUpdatedUser);

      const result = await UserService.update(1, mockUpdatedData);

      expect(UserRepository.findByID).toHaveBeenCalledWith(1);
      expect(UserRepository.update).toHaveBeenCalledWith(1, mockUpdatedData);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw an error if user is not found', async () => {
      UserRepository.findByID.mockResolvedValue(null);

      await expect(UserService.update(1, {})).rejects.toThrow(
        'user is not found'
      );
    });
  });

  describe('delete', () => {
    it('should delete the user successfully', async () => {
      const mockUser = { id: 1, name: 'John Doe' };

      UserRepository.findByID.mockResolvedValue(mockUser);
      UserRepository.delete.mockResolvedValue({ success: true });

      const result = await UserService.delete(1);

      expect(UserRepository.findByID).toHaveBeenCalledWith(1);
      expect(UserRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });

    it('should throw an error if user is not found', async () => {
      UserRepository.findByID.mockResolvedValue(null);

      await expect(UserService.delete(1)).rejects.toThrow('user is not found');
    });
  });
});
