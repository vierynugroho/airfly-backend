import { ErrorHandler } from '../middlewares/error.js';
import { NotificationRepository } from '../repositories/notification.js';
import { SocketIO } from '../utils/socket.js';

export class NotificationService {
  static async getAll(pagination, filter) {
    const notifications = await NotificationRepository.findMany(
      pagination,
      filter
    );
    const totalNotifications = await NotificationRepository.count(filter);

    return { notifications, totalNotifications };
  }

  static async getByID(notificationID) {
    const notification = await NotificationRepository.findByID(notificationID);

    if (!notification) {
      throw new ErrorHandler(404, 'notification is not found');
    }

    return notification;
  }

  static async create(data) {
    const isForSpecificUser = !!data?.userId;

    if (!isForSpecificUser) {
      const usersNotifications = await NotificationRepository.create(data);

      await SocketIO.pushBroadcastNotification(data);

      return usersNotifications;
    } else {
      const userNotification = await NotificationRepository.create(data);

      await SocketIO.pushSingleNotification(data.userId, data);

      return userNotification;
    }
  }

  static async update(notificationID, data) {
    const notification = await NotificationRepository.findByID(notificationID);

    if (!notification) {
      throw new ErrorHandler(404, 'notification is not found');
    }

    const updatedNotification = await NotificationRepository.update(
      notificationID,
      data
    );

    return updatedNotification;
  }

  static async delete(notificationID) {
    const notification = await NotificationRepository.findByID(notificationID);

    if (!notification) {
      throw new ErrorHandler(404, 'notification is not found');
    }

    const deletedNotification =
      await NotificationRepository.delete(notificationID);

    return deletedNotification;
  }

  static async getNotificationTypeEnum() {
    const notificationTypes =
      await NotificationRepository.getNotificationTypeEnum();

    return notificationTypes;
  }
}
