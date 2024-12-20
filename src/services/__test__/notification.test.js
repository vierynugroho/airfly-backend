import { NotificationService } from '../notification.js';
import { NotificationRepository } from '../../repositories/notification.js';
import { SocketIO } from '../../utils/socket.js';
import { ErrorHandler } from '../../middlewares/error.js';

jest.mock('../../repositories/notification.js');
jest.mock('../../utils/socket.js');

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    const mockPagination = { page: 1, limit: 10 };
    const mockFilter = { isRead: false };

    it('should return notifications and total count', async () => {
      const mockNotifications = [
        { id: 1, message: 'Test 1' },
        { id: 2, message: 'Test 2' },
      ];
      NotificationRepository.findMany.mockResolvedValue(mockNotifications);
      NotificationRepository.count.mockResolvedValue(2);

      const result = await NotificationService.getAll(
        mockPagination,
        mockFilter
      );

      expect(NotificationRepository.findMany).toHaveBeenCalledWith(
        mockPagination,
        mockFilter
      );
      expect(NotificationRepository.count).toHaveBeenCalledWith(mockFilter);
      expect(result).toEqual({
        notifications: mockNotifications,
        totalNotifications: 2,
      });
    });
  });

  describe('getByID', () => {
    it('should return notification by ID', async () => {
      const mockNotification = { id: 1, message: 'Test notification' };
      NotificationRepository.findByID.mockResolvedValue(mockNotification);

      const result = await NotificationService.getByID(1);

      expect(NotificationRepository.findByID).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNotification);
    });

    it('should throw error if notification not found', async () => {
      NotificationRepository.findByID.mockResolvedValue(null);

      await expect(NotificationService.getByID(1)).rejects.toThrow(
        new ErrorHandler(404, 'notification is not found')
      );
    });
  });

  describe('create', () => {
    it('should create broadcast notification successfully', async () => {
      const mockData = {
        message: 'Broadcast notification',
        type: 'ANNOUNCEMENT',
      };
      const mockCreatedNotification = { id: 1, ...mockData };

      NotificationRepository.create.mockResolvedValue(mockCreatedNotification);
      SocketIO.pushBroadcastNotification.mockResolvedValue(true);

      const result = await NotificationService.create(mockData);

      expect(NotificationRepository.create).toHaveBeenCalledWith(mockData);
      expect(SocketIO.pushBroadcastNotification).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockCreatedNotification);
    });

    it('should create specific user notification successfully', async () => {
      const mockData = {
        userId: 123,
        message: 'User notification',
        type: 'PERSONAL',
      };
      const mockCreatedNotification = { id: 1, ...mockData };

      NotificationRepository.create.mockResolvedValue(mockCreatedNotification);
      SocketIO.pushSingleNotification.mockResolvedValue(true);

      const result = await NotificationService.create(mockData);

      expect(NotificationRepository.create).toHaveBeenCalledWith(mockData);
      expect(SocketIO.pushSingleNotification).toHaveBeenCalledWith(
        mockData.userId,
        mockData
      );
      expect(result).toEqual(mockCreatedNotification);
    });
  });

  describe('update', () => {
    const mockData = {
      message: 'Updated notification',
      isRead: true,
    };

    it('should update notification successfully', async () => {
      const mockUpdatedNotification = { id: 1, ...mockData };
      NotificationRepository.findByID.mockResolvedValue({ id: 1 });
      NotificationRepository.update.mockResolvedValue(mockUpdatedNotification);

      const result = await NotificationService.update(1, mockData);

      expect(NotificationRepository.findByID).toHaveBeenCalledWith(1);
      expect(NotificationRepository.update).toHaveBeenCalledWith(1, mockData);
      expect(result).toEqual(mockUpdatedNotification);
    });

    it('should throw error if notification not found', async () => {
      NotificationRepository.findByID.mockResolvedValue(null);

      await expect(NotificationService.update(1, mockData)).rejects.toThrow(
        new ErrorHandler(404, 'notification is not found')
      );
    });
  });

  describe('delete', () => {
    it('should delete notification successfully', async () => {
      NotificationRepository.findByID.mockResolvedValue({ id: 1 });
      NotificationRepository.delete.mockResolvedValue({ success: true });

      const result = await NotificationService.delete(1);

      expect(NotificationRepository.findByID).toHaveBeenCalledWith(1);
      expect(NotificationRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });

    it('should throw error if notification not found', async () => {
      NotificationRepository.findByID.mockResolvedValue(null);

      await expect(NotificationService.delete(1)).rejects.toThrow(
        new ErrorHandler(404, 'notification is not found')
      );
    });
  });

  describe('getNotificationTypeEnum', () => {
    it('should return notification type enum', async () => {
      const mockTypes = {
        ANNOUNCEMENT: 'ANNOUNCEMENT',
        PERSONAL: 'PERSONAL',
      };
      NotificationRepository.getNotificationTypeEnum.mockResolvedValue(
        mockTypes
      );

      const result = await NotificationService.getNotificationTypeEnum();

      expect(NotificationRepository.getNotificationTypeEnum).toHaveBeenCalled();
      expect(result).toEqual(mockTypes);
    });
  });
});
