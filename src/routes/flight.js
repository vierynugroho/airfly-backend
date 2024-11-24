import express from 'express';
import validation from '../middlewares/validator.js';
import { FlightController } from '../controllers/flight.js';
import { flightSchema } from '../utils/validationSchema.js';

const router = express.Router();

router
  .route('/')
  .get(FlightController.getAll)
  .post(validation(flightSchema), FlightController.create);
router
  .route('/:id')
  .get(FlightController.getByID)
  .put(validation(flightSchema), FlightController.update)
  .delete(FlightController.delete);

export default router;
