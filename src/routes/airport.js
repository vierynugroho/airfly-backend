import express from 'express';
import validation from '../middlewares/validator.js';
import { AirportController } from '../controllers/airport.js';
import { airportSchema } from '../utils/validationSchema.js';
import { authorization } from '../middlewares/authorization.js';
import { UserRole } from '@prisma/client';

const router = express.Router();

router
  .route('/')
  .get(
    authorization([UserRole.BUYER, UserRole.ADMIN]),
    AirportController.getAll
  )
  .post(
    authorization([UserRole.ADMIN]),
    validation(airportSchema),
    AirportController.create
  );

router
  .route('/:id')
  .get(
    authorization([UserRole.BUYER, UserRole.ADMIN]),
    AirportController.getByID
  )
  .put(
    authorization([UserRole.ADMIN]),
    validation(airportSchema),
    AirportController.update
  )
  .delete(authorization([UserRole.ADMIN]), AirportController.delete);

export default router;
