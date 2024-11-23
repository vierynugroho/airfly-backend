import express from 'express';
import validation from '../middlewares/validator.js';
import { SeatController } from '../controllers/seat.js';
import { seatSchema } from '../utils/validationSchema.js';

const router = express.Router();

router
  .route('/')
  .get(SeatController.getAll)
  .post(validation(seatSchema), SeatController.create);
router
  .route('/:id')
  .get(SeatController.getByID)
  .put(validation(seatSchema), SeatController.update)
  .delete(SeatController.delete);

export default router;
