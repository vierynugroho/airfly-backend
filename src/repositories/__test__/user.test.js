import { UserRepository } from '../user';
import { prisma } from '../../database/db';

jest.mock('../../database/db', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('UserRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findMany', () => {
    it('should return users with pagination and filter', async () => {
      const pagination = { offset: 0, limit: 10 };
      const filter = { active: true };
      const mockUsers = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Smith' },
      ];

      prisma.user.findMany.mockResolvedValue(mockUsers);

      const result = await UserRepository.findMany(pagination, filter);

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: pagination.offset,
        take: pagination.limit,
        where: filter,
        include: {
          _count: true,
          booking: {
            include: {
              _count: true,
            },
          },
          Notification: true,
        },
      });
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUsersID', () => {
    it('should return list of user IDs', async () => {
      const mockUsersID = [{ id: 1 }, { id: 2 }];
      prisma.user.findMany.mockResolvedValue(mockUsersID);

      const result = await UserRepository.getUsersID();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: { id: true },
      });
      expect(result).toEqual(mockUsersID);
    });
  });

  describe('findByID', () => {
    it('should return a user by ID', async () => {
      const userID = 1;
      const mockUser = { id: 1, firstName: 'John', lastName: 'Doe' };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await UserRepository.findByID(userID);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userID },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const userID = 999;

      prisma.user.findUnique.mockResolvedValue(null);

      const result = await UserRepository.findByID(userID);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userID },
      });
      expect(result).toBeNull();
    });
  });

  describe('count', () => {
    it('should return the total count of users with the filter', async () => {
      const filter = { active: true };
      const mockCount = 5;

      prisma.user.count.mockResolvedValue(mockCount);

      const result = await UserRepository.count(filter);

      expect(prisma.user.count).toHaveBeenCalledWith({ where: filter });
      expect(result).toEqual(mockCount);
    });
  });

  describe('update', () => {
    it('should update and return the updated user', async () => {
      const userID = 1;
      const data = { firstName: 'Updated' };
      const mockUpdatedUser = { id: 1, firstName: 'Updated', lastName: 'Doe' };

      prisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await UserRepository.update(userID, data);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userID },
        data,
      });
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('delete', () => {
    it('should delete and return the deleted user', async () => {
      const userID = 1;
      const mockDeletedUser = { id: 1, firstName: 'John', lastName: 'Doe' };

      prisma.user.update.mockResolvedValue(mockDeletedUser);

      const result = await UserRepository.delete(userID);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userID },
        data: {
          status: 'UNVERIFIED',
        },
      });
      expect(result).toEqual(mockDeletedUser);
    });
  });
});
