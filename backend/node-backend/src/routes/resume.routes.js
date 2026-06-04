import express from 'express';
import { getResume, createOrUpdateResume } from '../controllers/resume.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getResume);

router.post('/', protect, createOrUpdateResume);

export default router;
