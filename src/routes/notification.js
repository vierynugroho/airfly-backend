import { Router } from 'express';
import { authorization } from '../middlewares/authorization.js';
import validation from '../middlewares/validator.js';
import {
  notificationSchema,
  readNotificationSchema,
} from '../utils/validationSchema.js';
import { NotificationController } from '../controllers/notification.js';
import { UserRole } from '@prisma/client';

const notificationRouter = Router();

notificationRouter
  .route('/')
  .get(
    authorization([UserRole.ADMIN, UserRole.BUYER]),
    NotificationController.getAll
  )
  .post(
    authorization([UserRole.ADMIN]),
    validation(notificationSchema),
    NotificationController.create
  );

notificationRouter
  .route('/:id')
  .get(authorization([UserRole.ADMIN]), NotificationController.getByID)
  .put(
    authorization([UserRole.ADMIN]),
    validation(notificationSchema),
    NotificationController.update
  )
  .delete(authorization([UserRole.ADMIN]), NotificationController.delete);

notificationRouter
  .route('/user/user-notifications')
  .get(
    authorization([UserRole.ADMIN, UserRole.BUYER]),
    NotificationController.getByUserID
  );

notificationRouter
  .route('/read/mark-as-read')
  .patch(
    authorization([UserRole.ADMIN, UserRole.BUYER]),
    validation(readNotificationSchema),
    NotificationController.markAsRead
  );

export default notificationRouter;
