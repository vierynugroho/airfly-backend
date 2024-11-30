import express from 'express';
import { AirlineController } from '../controllers/airline.js';
import { airlineSchema } from '../utils/validationSchema.js';
// import { authorization } from '../middlewares/authorization.js';
// import { UserRole } from '@prisma/client';
import validation from '../middlewares/validator.js';
import imageHandlerMiddleware from '../middlewares/multer.js';

const router = express.Router();

router
  .route('/')
  .get(AirlineController.getAll)
  .post(
    imageHandlerMiddleware,
    validation(airlineSchema),
    AirlineController.createWithImage
  );

router
  .route('/:id')
  .get(AirlineController.getByID)
  .put(
    imageHandlerMiddleware,
    validation(airlineSchema),
    AirlineController.updateWithImage
  )
  .delete(AirlineController.delete);

export default router;
