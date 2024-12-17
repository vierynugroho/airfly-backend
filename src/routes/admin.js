import express from 'express';
import { AdminController } from '../controllers/admin.js';

const router = express.Router();

router.get('/count', authorization([UserRole.ADMIN]), AdminController.count);

export default router;
