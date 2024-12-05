import express from 'express';
import { signupAdmin, signin, createRole } from '../controller/authController.js';
import { protect, adminOnly } from '../middleware/Protect.js';

const router = express.Router();

// Auth routes
router.post('/signup-admin', signupAdmin);
router.post('/signin', signin);
router.post('/create-role', protect, adminOnly, createRole);

export default router;
