import { NotificationType } from '@prisma/client';
import { prisma } from '../database/db.js';

export class NotificationRepository {
  static async findMany(pagination, filter) {
    const notifications = await prisma.notification.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      where: filter,
    });

    return notifications;
  }

  static async findByID(notificationID) {
    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationID,
      },
    });

    return notification;
  }

  static async getNotificationTypeEnum() {
    return NotificationType;
  }

  static async count(filter) {
    const totalNotifications = await prisma.notification.count({
      where: filter,
    });

    return totalNotifications;
  }

  static async create(data) {
    const createddNotification = await prisma.notification.create({
      data,
    });

    return createddNotification;
  }

  static async update(notificationID, data) {
    console.log({ notificationID, data });
    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationID,
      },
      data,
    });

    return updatedNotification;
  }

  static async delete(notificationID) {
    const deletedNotification = await prisma.notification.delete({
      where: {
        id: notificationID,
      },
    });

    return deletedNotification;
  }
}
