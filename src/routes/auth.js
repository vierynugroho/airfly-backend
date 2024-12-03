import express from 'express';
import { AuthController } from '../controllers/auth.js';
import validation from '../middlewares/validator.js';
import { authorization } from '../middlewares/authorization.js';
import { loginSchema, registerSchema } from '../utils/validationSchema.js';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post('/login', validation(loginSchema), AuthController.login);
router.post('/register', validation(registerSchema), AuthController.register);
router.post('/verify', AuthController.verify);
router.post('/reset-otp', AuthController.sendResetOtp);
router.post('/reset-password', AuthController.resetPassword);
router.post('/login-oauth', AuthController.loginGoogle);
router.get(
  '/me',
  authorization([UserRole.ADMIN, UserRole.BUYER]),
  AuthController.getUserLoggedIn
);

export default router;
