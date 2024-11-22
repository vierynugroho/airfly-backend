import express from 'express';
import { AuthController } from '../controllers/auth.js';
import validation from '../middlewares/validator.js';
import { loginSchema } from '../utils/validationSchema.js';

const router = express.Router();

router.post('/login', validation(loginSchema), AuthController.login);

export default router;
