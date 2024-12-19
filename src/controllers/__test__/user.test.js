import { UserController } from './../user.js';
import { UserService } from './../../services/user.js';
import { ErrorHandler } from './../../middlewares/error.js';
// Mock the UserService
jest.mock('./../../services/user.js');

describe('UserController', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      query: {},
      params: {},
      body: {},
      user: {},
    };
    mockRes = {
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    const mockUsers = [
      { id: 1, firstName: 'Test', lastName: 'User', email: 'test@example.com' },
      {
        id: 2,
        firstName: 'Test2',
        lastName: 'User2',
        email: 'test2@example.com',
      },
    ];

    it('should get all users without pagination', async () => {
      UserService.getAll.mockResolvedValue({ users: mockUsers, totalUsers: 2 });

      await UserController.getAll(mockReq, mockRes, mockNext);

      expect(UserService.getAll).toHaveBeenCalledWith({}, {});
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'users data retrieved successfully',
          pagination: null,
        },
        data: mockUsers,
      });
    });

    it('should get users with pagination', async () => {
      mockReq.query = { page: '1', limit: '10' };
      UserService.getAll.mockResolvedValue({ users: mockUsers, totalUsers: 2 });

      await UserController.getAll(mockReq, mockRes, mockNext);

      expect(UserService.getAll).toHaveBeenCalledWith(
        { offset: 0, limit: 10 },
        {}
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'users data retrieved successfully',
          pagination: {
            totalPage: 1,
            currentPage: 1,
            pageItems: 2,
            nextPage: null,
            prevPage: null,
          },
        },
        data: mockUsers,
      });
    });

    it('should handle invalid user status', async () => {
      mockReq.query = { userStatus: 'INVALID' };

      await UserController.getAll(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });
  });

  describe('getByID', () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    };

    it('should get user by ID successfully', async () => {
      mockReq.params = { id: '1' };
      UserService.getByID.mockResolvedValue(mockUser);

      await UserController.getByID(mockReq, mockRes, mockNext);

      expect(UserService.getByID).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'user data retrieved successfully',
        },
        data: mockUser,
      });
    });

    it('should handle invalid user ID', async () => {
      mockReq.params = { id: 'invalid' };

      await UserController.getByID(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });
  });

  describe('update', () => {
    const mockUpdatedUser = {
      id: 3,
      firstName: 'Test Update',
      lastName: 'Shinomiya',
      email: 'kutakulu@gmail.com',
      phone: '086655446677',
      status: 'VERIFIED',
      role: 'BUYER',
    };

    it('should update user successfully', async () => {
      mockReq.params = { id: '3' };
      mockReq.body = {
        firstName: 'Test Update',
        lastName: 'Shinomiya',
      };
      UserService.update.mockResolvedValue(mockUpdatedUser);

      await UserController.update(mockReq, mockRes, mockNext);

      expect(UserService.update).toHaveBeenCalledWith(3, mockReq.body);
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'user data updated successfully',
        },
        data: mockUpdatedUser,
      });
    });

    it('should handle invalid user ID in update', async () => {
      mockReq.params = { id: 'invalid' };

      await UserController.update(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });
  });

  describe('profileUpdate', () => {
    const mockUpdatedProfile = {
      id: 3,
      firstName: 'Test Update',
      lastName: 'Shinomiya',
      email: 'kutakulu@gmail.com',
      phone: '086655446677',
      status: 'VERIFIED',
      role: 'BUYER',
    };

    it('should update user profile successfully', async () => {
      mockReq.user = { id: 3 };
      mockReq.body = {
        firstName: 'Test Update',
        lastName: 'Shinomiya',
      };
      UserService.update.mockResolvedValue(mockUpdatedProfile);

      await UserController.profileUpdate(mockReq, mockRes, mockNext);

      expect(UserService.update).toHaveBeenCalledWith(3, mockReq.body);
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'user profile updated successfully',
        },
        data: mockUpdatedProfile,
      });
    });

    it('should handle service errors in profile update', async () => {
      mockReq.user = { id: 3 };
      const error = new Error('Service error');
      UserService.update.mockRejectedValue(error);

      await UserController.profileUpdate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('delete and accountDelete', () => {
    const mockDeletedUser = {
      id: 3,
      firstName: 'Test',
      lastName: 'User',
      status: 'DELETED',
    };

    it('should delete user successfully', async () => {
      mockReq.params = { id: '3' };
      UserService.delete.mockResolvedValue(mockDeletedUser);

      await UserController.delete(mockReq, mockRes, mockNext);

      expect(UserService.delete).toHaveBeenCalledWith(3);
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'user deleted successfully',
        },
        data: mockDeletedUser,
      });
    });

    it('should delete account successfully', async () => {
      mockReq.user = { id: 3 };
      UserService.delete.mockResolvedValue(mockDeletedUser);

      await UserController.accountDelete(mockReq, mockRes, mockNext);

      expect(UserService.delete).toHaveBeenCalledWith(3);
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'user account deleted successfully',
        },
        data: mockDeletedUser,
      });
    });
  });
});
