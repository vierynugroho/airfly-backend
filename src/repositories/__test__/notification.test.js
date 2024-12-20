import { NotificationRepository } from '../notification.js';
import { prisma } from '../../database/db.js';
import { NotificationType } from '@prisma/client';

jest.mock('../../database/db.js', () => ({
  prisma: {
    notification: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('NotificationRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('findMany', () => {
    it('should return notifications with pagination and filter', async () => {
      const mockNotifications = [{ id: 1, message: 'Test notification' }];
      const pagination = { offset: 0, limit: 10 };
      const filter = { message: { contains: 'Test' } };

      prisma.notification.findMany.mockResolvedValue(mockNotifications);

      const result = await NotificationRepository.findMany(pagination, filter);

      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        skip: pagination.offset,
        take: pagination.limit,
        where: filter,
      });
      expect(result).toEqual(mockNotifications);
    });
  });

  describe('findByID', () => {
    it('should return a notification by ID', async () => {
      const mockNotification = { id: 1, message: 'Test notification' };
      const notificationID = 1;

      prisma.notification.findUnique.mockResolvedValue(mockNotification);

      const result = await NotificationRepository.findByID(notificationID);

      expect(prisma.notification.findUnique).toHaveBeenCalledWith({
        where: { id: notificationID },
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('getNotificationTypeEnum', () => {
    it('should return the NotificationType enum', async () => {
      const result = await NotificationRepository.getNotificationTypeEnum();

      expect(result).toBe(NotificationType);
    });
  });

  describe('count', () => {
    it('should return the count of notifications based on filter', async () => {
      const mockCount = 5;
      const filter = { message: { contains: 'Test' } };

      prisma.notification.count.mockResolvedValue(mockCount);

      const result = await NotificationRepository.count(filter);

      expect(prisma.notification.count).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toBe(mockCount);
    });
  });

  describe('create', () => {
    it('should create a new notification', async () => {
      const mockNotification = { id: 1, message: 'New notification' };
      const data = { message: 'New notification' };

      prisma.notification.create.mockResolvedValue(mockNotification);

      const result = await NotificationRepository.create(data);

      expect(prisma.notification.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('update', () => {
    it('should update a notification by ID', async () => {
      const mockNotification = { id: 1, message: 'Updated notification' };
      const notificationID = 1;
      const data = { message: 'Updated notification' };

      prisma.notification.update.mockResolvedValue(mockNotification);

      const result = await NotificationRepository.update(notificationID, data);

      expect(prisma.notification.update).toHaveBeenCalledWith({
        where: { id: notificationID },
        data,
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('delete', () => {
    it('should delete a notification by ID', async () => {
      const mockNotification = { id: 1, message: 'Deleted notification' };
      const notificationID = 1;

      prisma.notification.delete.mockResolvedValue(mockNotification);

      const result = await NotificationRepository.delete(notificationID);

      expect(prisma.notification.delete).toHaveBeenCalledWith({
        where: { id: notificationID },
      });
      expect(result).toEqual(mockNotification);
    });
  });
});
