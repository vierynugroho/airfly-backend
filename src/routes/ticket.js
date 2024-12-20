import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authorization } from '../middlewares/authorization.js';
import { TicketController } from '../controllers/ticket.js';
import validation from '../middlewares/validator.js';
import { QRCodeSchema } from '../utils/validationSchema.js';

export const ticketRouter = Router();

ticketRouter
  .route('/:bookingID')
  .post(authorization([UserRole.BUYER]), TicketController.create);

ticketRouter
  .route('/validate/qr-ticket')
  .post(
    authorization([UserRole.BUYER, UserRole.ADMIN]),
    validation(QRCodeSchema),
    TicketController.validate
  );
