import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authorization } from '../middlewares/authorization.js';
import { createBooking } from '../controllers/booking.js';

export const bookingRoute = Router();

bookingRoute.post(
  '/create',
  authorization([UserRole.BUYER, UserRole.ADMIN]),
  createBooking
);
