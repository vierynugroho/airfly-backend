import express from 'express';
import { PaymentController } from '../controllers/payment.js';
import { authorization } from '../middlewares/authorization.js';
import validation from '../middlewares/validator.js';
import { transactionSchema } from '../utils/validationSchema.js';
import { UserRole } from '@prisma/client';

const router = express.Router();

router
  .route('/')
  .post(
    authorization([UserRole.ADMIN, UserRole.BUYER]),
    validation(transactionSchema),
    PaymentController.create
  )
  .get(
    authorization([UserRole.ADMIN, UserRole.BUYER]),
    PaymentController.getAll
  );

router
  .route('/:id')
  .get(
    authorization([UserRole.ADMIN, UserRole.BUYER]),
    PaymentController.getById
  )
  .delete(authorization([UserRole.ADMIN]), PaymentController.delete);

router.post('/webhook', PaymentController.handleWebhook);

router.post(
  '/:orderId/cancel',
  authorization([UserRole.ADMIN, UserRole.BUYER]),
  PaymentController.cancel
);

export default router;
