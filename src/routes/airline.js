import express from 'express';
import { AirlineController } from '../controllers/airline.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router
  .route('/')
  .get(AirlineController.getAll)
  .post(upload.single('image'), AirlineController.createWithImage);

router
  .route('/:id')
  .get(AirlineController.getByID)
  .put(upload.single('image'), AirlineController.updateWithImage)
  .delete(AirlineController.delete);

export default router;
