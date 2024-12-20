import { NotificationController } from './../notification.js';
import { NotificationService } from './../../services/notification.js';
import { ErrorHandler } from './../../middlewares/error.js';

// Mock the NotificationService
jest.mock('./../../services/notification.js');

describe('NotificationController', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: {
        id: 1,
        role: 'BUYER',
      },
    };
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    const mockNotificationsData = {
      notifications: [
        {
          id: 1,
          type: 'PROMO',
          message: 'Test notification',
          isRead: false,
        },
      ],
      totalNotifications: 1,
    };

    beforeEach(() => {
      NotificationService.getNotificationTypeEnum.mockResolvedValue({
        PROMO: 'PROMO',
        SYSTEM: 'SYSTEM',
      });
    });

    it('should return notifications with pagination', async () => {
      mockRequest.query = {
        page: '1',
        limit: '10',
      };
      NotificationService.getAll.mockResolvedValue(mockNotificationsData);

      await NotificationController.getAll(mockRequest, mockResponse, mockNext);

      expect(NotificationService.getAll).toHaveBeenCalledWith(
        { offset: 0, limit: 10 },
        {}
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'notifications data retrieved successfully',
          pagination: {
            totalPage: 1,
            currentPage: 1,
            pageItems: 1,
            nextPage: null,
            prevPage: null,
          },
        },
        data: mockNotificationsData.notifications,
      });
    });

    it('should filter by notification type', async () => {
      mockRequest.query = { type: 'PROMO' };
      NotificationService.getAll.mockResolvedValue(mockNotificationsData);

      await NotificationController.getAll(mockRequest, mockResponse, mockNext);

      expect(NotificationService.getAll).toHaveBeenCalledWith(
        {},
        { type: 'PROMO' }
      );
    });

    it('should handle invalid notification type', async () => {
      mockRequest.query = { type: 'INVALID' };

      await NotificationController.getAll(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });
  });

  describe('getByUserID', () => {
    const mockNotificationsData = {
      notifications: [
        {
          id: 1,
          userId: 1,
          type: 'PROMO',
          message: 'Test notification',
        },
      ],
      totalNotifications: 1,
    };

    beforeEach(() => {
      NotificationService.getNotificationTypeEnum.mockResolvedValue({
        PROMO: 'PROMO',
        SYSTEM: 'SYSTEM',
      });
    });

    it('should return notifications for buyer with correct conditions', async () => {
      mockRequest.query = {
        page: '1',
        limit: '10',
        type: 'PROMO',
      };
      mockRequest.user = { id: 1, role: 'BUYER' };
      NotificationService.getAll.mockResolvedValue(mockNotificationsData);

      await NotificationController.getByUserID(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(NotificationService.getAll).toHaveBeenCalledWith(
        { offset: 0, limit: 10 },
        {
          OR: [{ userId: 1 }, { userId: null }],
          type: 'PROMO',
        }
      );
    });

    it('should handle invalid user ID', async () => {
      mockRequest.user.id = 'invalid';

      await NotificationController.getByUserID(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });
  });

  describe('getByID', () => {
    const mockNotification = {
      id: 1,
      type: 'PROMO',
      message: 'Test notification',
    };

    it('should return notification when valid ID is provided', async () => {
      mockRequest.params = { id: '1' };
      NotificationService.getByID.mockResolvedValue(mockNotification);

      await NotificationController.getByID(mockRequest, mockResponse, mockNext);

      expect(NotificationService.getByID).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'notification data retrieved successfully',
        },
        data: mockNotification,
      });
    });

    it('should handle invalid ID format', async () => {
      mockRequest.params = { id: 'invalid' };

      await NotificationController.getByID(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });
  });

  describe('create', () => {
    const mockNotificationData = {
      type: 'PROMO',
      message: 'Test notification',
    };

    it('should create notification successfully', async () => {
      mockRequest.body = mockNotificationData;
      NotificationService.create.mockResolvedValue(mockNotificationData);

      await NotificationController.create(mockRequest, mockResponse, mockNext);

      expect(NotificationService.create).toHaveBeenCalledWith(
        mockNotificationData
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'users notification created successfully',
        },
        data: mockNotificationData,
      });
    });

    it('should handle create errors', async () => {
      const error = new Error('Create error');
      NotificationService.create.mockRejectedValue(error);
      mockRequest.body = mockNotificationData;

      await NotificationController.create(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('markAsRead', () => {
    const mockReadData = {
      notificationID: 1,
      isRead: true,
    };

    it('should mark notification as read successfully', async () => {
      mockRequest.body = mockReadData;
      mockRequest.user = { id: 1 };
      NotificationService.update.mockResolvedValue({
        id: 1,
        isRead: true,
      });

      await NotificationController.markAsRead(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(NotificationService.update).toHaveBeenCalledWith(1, {
        id: 1,
        isRead: true,
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'user notification updated successfully',
        },
        data: expect.objectContaining({ isRead: true }),
      });
    });
  });

  describe('update', () => {
    const mockUpdateData = {
      message: 'Updated notification',
    };

    it('should update notification successfully', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = mockUpdateData;
      NotificationService.update.mockResolvedValue({
        id: 1,
        ...mockUpdateData,
      });

      await NotificationController.update(mockRequest, mockResponse, mockNext);

      expect(NotificationService.update).toHaveBeenCalledWith(
        1,
        mockUpdateData
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'notification data updated successfully',
        },
        data: expect.objectContaining(mockUpdateData),
      });
    });

    it('should handle invalid ID format for update', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = mockUpdateData;

      await NotificationController.update(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });
  });

  describe('delete', () => {
    it('should delete notification successfully', async () => {
      mockRequest.params = { id: '1' };
      NotificationService.delete.mockResolvedValue({ id: 1 });

      await NotificationController.delete(mockRequest, mockResponse, mockNext);

      expect(NotificationService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'notification deleted successfully',
        },
        data: expect.objectContaining({ id: 1 }),
      });
    });

    it('should handle invalid ID format for delete', async () => {
      mockRequest.params = { id: 'invalid' };

      await NotificationController.delete(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });
  });
});
