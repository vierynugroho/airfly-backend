import { ErrorHandler } from '../middlewares/error.js';
import { NotificationService } from '../services/notification.js';

export class NotificationController {
  static async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || null;
      const notificationType = req.query.type;

      let condition = {};
      const pagination = {};

      if (notificationType) {
        let notificationTypeValid =
          await NotificationService.getNotificationTypeEnum();

        const formattedType = notificationType.toUpperCase();

        if (!Object.values(notificationTypeValid).includes(formattedType)) {
          throw new ErrorHandler(
            422,
            `Invalid notification type value. Allowed types: ${Object.values(notificationTypeValid).join(', ')}`
          );
        }

        condition.type = formattedType;
      }

      if (page && limit) {
        pagination.offset = (page - 1) * limit;
        pagination.limit = limit;
      }

      const { notifications, totalNotifications } =
        await NotificationService.getAll(pagination, condition);

      res.json({
        meta: {
          statusCode: 200,
          message: 'notifications data retrieved successfully',
          pagination:
            page && limit
              ? {
                  totalPage: Math.ceil(totalNotifications / limit),
                  currentPage: page,
                  pageItems: notifications.length,
                  nextPage:
                    page < Math.ceil(totalNotifications / limit)
                      ? page + 1
                      : null,
                  prevPage: page > 1 ? page - 1 : null,
                }
              : null,
        },
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByID(req, res, next) {
    try {
      const notificationID = parseInt(req.params.id);

      if (isNaN(notificationID)) {
        throw new ErrorHandler(422, 'notification ID is not a number');
      }

      const notification = await NotificationService.getByID(notificationID);

      res.json({
        meta: {
          statusCode: 200,
          message: 'notification data retrieved successfully',
        },
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByUserID(req, res, next) {
    try {
      const userID = parseInt(req.user.id);
      const userRole = req.user.role;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || null;

      if (isNaN(userID)) {
        throw new ErrorHandler(422, 'user ID is not a number');
      }

      let condition = {};

      if (userRole === 'BUYER') {
        console.log(true);
        condition = {
          userId: userID,
        };
      }

      const notificationType = req.query.type;

      const pagination = {};

      if (notificationType) {
        let notificationTypeValid =
          await NotificationService.getNotificationTypeEnum();

        const formattedType = notificationType.toUpperCase();

        if (!Object.values(notificationTypeValid).includes(formattedType)) {
          throw new ErrorHandler(
            422,
            `Invalid notification type value. Allowed types: ${Object.values(notificationTypeValid).join(', ')}`
          );
        }

        condition.type = formattedType;
      }

      if (page && limit) {
        pagination.offset = (page - 1) * limit;
        pagination.limit = limit;
      }

      const { notifications, totalNotifications } =
        await NotificationService.getAll(pagination, condition);

      res.json({
        meta: {
          statusCode: 200,
          message: 'notifications data retrieved successfully',
          pagination:
            page && limit
              ? {
                  totalPage: Math.ceil(totalNotifications / limit),
                  currentPage: page,
                  pageItems: notifications.length,
                  nextPage:
                    page < Math.ceil(totalNotifications / limit)
                      ? page + 1
                      : null,
                  prevPage: page > 1 ? page - 1 : null,
                }
              : null,
        },
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const data = req.body;

      const notification = await NotificationService.create(data);

      res.json({
        meta: {
          statusCode: 200,
          message: 'users notification created successfully',
        },
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req, res, next) {
    try {
      const data = req.body;
      data.userId = req.user.id;

      const readNotificationData = {
        id: data.notificationID,
        isRead: data.isRead,
      };

      const notification = await NotificationService.update(
        data.notificationID,
        readNotificationData
      );

      res.json({
        meta: {
          statusCode: 200,
          message: 'user notification updated successfully',
        },
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const data = req.body;
      const notificationID = parseInt(req.params.id);

      if (isNaN(notificationID)) {
        throw new ErrorHandler(422, 'notification ID is not a number');
      }

      const notification = await NotificationService.update(
        notificationID,
        data
      );

      res.json({
        meta: {
          statusCode: 200,
          message: 'notification data updated successfully',
        },
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const notificationID = parseInt(req.params.id);

      if (isNaN(notificationID)) {
        throw new ErrorHandler(422, 'notification ID is not a number');
      }

      const notification = await NotificationService.delete(notificationID);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'notification deleted successfully',
        },
        data: notification,
      });
    } catch (e) {
      next(e);
    }
  }
}
