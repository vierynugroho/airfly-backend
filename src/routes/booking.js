import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authorization } from '../middlewares/authorization.js';
import { BookingController } from '../controllers/booking.js';

export const bookingRoute = Router();

bookingRoute
  .route('/')
  .post(authorization([UserRole.BUYER]), BookingController.createBooking)
  .get(
    authorization([UserRole.BUYER, UserRole.ADMIN]),
    BookingController.getAll
  );

bookingRoute.get(
  '/group',
  authorization([UserRole.BUYER, UserRole.ADMIN]),
  BookingController.getGroupedBy
);

bookingRoute.get(
  '/code/:code',
  authorization([UserRole.BUYER, UserRole.ADMIN]),
  BookingController.getByCode
);

bookingRoute.get(
  '/id/:id',
  authorization([UserRole.BUYER, UserRole.ADMIN]),
  BookingController.getById
);
