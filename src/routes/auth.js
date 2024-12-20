import express from 'express';
import { AuthController } from '../controllers/auth.js';
import validation from '../middlewares/validator.js';
import { authorization } from '../middlewares/authorization.js';
import {
  loginSchema,
  registerSchema,
  resetOtpSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from '../utils/validationSchema.js';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post('/login', validation(loginSchema), AuthController.login);
router.post('/register', validation(registerSchema), AuthController.register);
router.post('/verify', validation(verifyOtpSchema), AuthController.verify);
router.post(
  '/reset-otp',
  validation(resetOtpSchema),
  AuthController.sendResetOtp
);
router.post(
  '/reset-password',
  validation(resetPasswordSchema),
  AuthController.resetPassword
);
router.post('/login-google', AuthController.loginGoogle);
router.get(
  '/me',
  authorization([UserRole.ADMIN, UserRole.BUYER]),
  AuthController.getUserLoggedIn
);

export default router;
