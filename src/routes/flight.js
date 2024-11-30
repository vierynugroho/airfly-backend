import express from 'express';
import validation from '../middlewares/validator.js';
import { FlightController } from '../controllers/flight.js';
import { flightSchema } from '../utils/validationSchema.js';
import { authorization } from '../middlewares/authorization.js';
import { UserRole } from '@prisma/client';

const router = express.Router();

router
  .route('/')
  .get(FlightController.getAll)
  .post(
    authorization([UserRole.BUYER, UserRole.ADMIN]),
    validation(flightSchema),
    FlightController.create
  );
router
  .route('/:id')
  .get(FlightController.getByID)
  .put(
    authorization([UserRole.ADMIN]),
    validation(flightSchema),
    FlightController.update
  )
  .delete(authorization([UserRole.ADMIN]), FlightController.delete);

export default router;
