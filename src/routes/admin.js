import express from 'express';
import { AdminController } from '../controllers/admin.js';
import { authorization } from '../middlewares/authorization.js';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/count', authorization([UserRole.ADMIN]), AdminController.count);

export default router;
