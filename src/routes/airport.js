import express from 'express';
import validation from '../middlewares/validator.js';
import { AirportController } from '../controllers/airport.js';
import { airportSchema } from '../utils/validationSchema.js';
import { authorization } from '../middlewares/authorization.js';
import { UserRole } from '@prisma/client';
import fileHandlerMiddleware from '../middlewares/fileHandler.js';

const router = express.Router();

router
  .route('/')
  .get(AirportController.getAll)
  .post(
    authorization([UserRole.ADMIN]),
    fileHandlerMiddleware,
    validation(airportSchema),
    AirportController.create
  );

router
  .route('/:id')
  .get(AirportController.getByID)
  .put(
    authorization([UserRole.ADMIN]),
    fileHandlerMiddleware,
    validation(airportSchema),
    AirportController.update
  )
  .delete(authorization([UserRole.ADMIN]), AirportController.delete);

export default router;
