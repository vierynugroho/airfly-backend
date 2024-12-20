import express from 'express';
import { AirlineController } from '../controllers/airline.js';
import { airlineSchema } from '../utils/validationSchema.js';
import { authorization } from '../middlewares/authorization.js';
import { UserRole } from '@prisma/client';
import validation from '../middlewares/validator.js';
import fileHandlerMiddleware from '../middlewares/fileHandler.js';

const router = express.Router();

router
  .route('/')
  .get(AirlineController.getAll)
  .post(
    authorization([UserRole.ADMIN]),
    fileHandlerMiddleware,
    validation(airlineSchema),
    AirlineController.create
  );

router
  .route('/:id')
  .get(AirlineController.getByID)
  .put(
    authorization([UserRole.ADMIN]),
    fileHandlerMiddleware,
    validation(airlineSchema),
    AirlineController.update
  )
  .delete(authorization([UserRole.ADMIN]), AirlineController.delete);

export default router;
