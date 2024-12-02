import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authorization } from '../middlewares/authorization.js';
import { BookingController } from '../controllers/booking.js';

export const bookingRoute = Router();

bookingRoute.post(
  '/',
  authorization([UserRole.BUYER]),
  BookingController.createBooking
);

bookingRoute.get(
  '/',
  authorization([UserRole.BUYER]),
  BookingController.getAll
);

bookingRoute.get(
  '/:id',
  authorization([UserRole.BUYER]),
  BookingController.getById
);
