import express from 'express';
import { AuthController } from '../controllers/auth.js';
import validation from '../middlewares/validator.js';
import { loginSchema, registerSchema } from '../utils/validationSchema.js';

const router = express.Router();

router.post('/login', validation(loginSchema), AuthController.login);
router.post('/register', validation(registerSchema), AuthController.register);
router.post('/otp', AuthController.OTP);
router.post('/verify', AuthController.verify);
router.post('/reset-otp', AuthController.sendResetOtp);
router.post('/reset-password', AuthController.resetPassword);

export default router;
