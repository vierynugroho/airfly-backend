import express from 'express';
import { AirlineController } from '../controllers/airline.js';
import { airlineSchema } from '../utils/validationSchema.js';
import validation from '../middlewares/validator.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router
  .route('/')
  .get(AirlineController.getAll)
  .post(
    authorization([UserRole.ADMIN]),
    upload.single('image'),
    validation(airlineSchema),
    AirlineController.createWithImage
  );

router
  .route('/:id')
  .get(AirlineController.getByID)
  .put(
    authorization([UserRole.ADMIN]),
    upload.single('image'),
    validation(airlineSchema),
    AirlineController.updateWithImage
  )
  .delete(AirlineController.delete);

export default router;
