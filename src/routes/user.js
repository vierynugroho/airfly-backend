import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authorization } from '../middlewares/authorization.js';
import { UserController } from '../controllers/user.js';
import validation from '../middlewares/validator.js';
import {
  updateProfileSchema,
  updateUserSchema,
} from '../utils/validationSchema.js';

const userRouter = Router();

userRouter
  .route('/profile')
  .patch(
    authorization(UserRole.BUYER),
    validation(updateProfileSchema),
    UserController.profileUpdate
  )
  .delete(authorization(UserRole.BUYER), UserController.accountDelete);

userRouter.route('/').get(authorization(UserRole.ADMIN), UserController.getAll);
userRouter
  .route('/:id')
  .get(authorization(UserRole.ADMIN), UserController.getByID)
  .put(
    authorization(UserRole.ADMIN),
    validation(updateUserSchema),
    UserController.update
  )
  .delete(authorization(UserRole.ADMIN), UserController.delete);

export default userRouter;
