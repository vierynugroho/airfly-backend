import express from 'express';
import validation from '../middlewares/validator.js';
import { SeatController } from '../controllers/seat.js';
import { authorization } from '../middlewares/authorization.js';
import { seatSchema } from '../utils/validationSchema.js';
import { UserRole } from '@prisma/client';

const router = express.Router();

router
  .route('/')
  .get(authorization([UserRole.BUYER, UserRole.ADMIN]), SeatController.getAll)
  .post(
    authorization([UserRole.ADMIN]),
    validation(seatSchema),
    SeatController.create
  );
router
  .route('/:id')
  .get(authorization([UserRole.BUYER, UserRole.ADMIN]), SeatController.getByID)
  .put(
    authorization([UserRole.ADMIN]),
    validation(seatSchema),
    SeatController.update
  )
  .delete(authorization([UserRole.ADMIN]), SeatController.delete);

export default router;
