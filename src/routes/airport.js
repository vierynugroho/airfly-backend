import express from 'express';
import validation from '../middlewares/validator.js';
import { AirportController } from '../controllers/airport.js';
import { airportSchema } from '../utils/validationSchema.js';

const router = express.Router();

router
  .route('/')
  .get(AirportController.getAll)
  .post(validation(airportSchema), AirportController.create);

router
  .route('/:id')
  .get(AirportController.getByID)
  .put(validation(airportSchema), AirportController.update)
  .delete(AirportController.delete);

export default router;
