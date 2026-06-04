import express from 'express';
import { protect } from '../middleware/auth.js';
import { updateProfile, getProfile } from '../controllers/profile.controller.js';
import { profileValidator } from '../validators/profile.validator.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get(
    '/', 
    protect, 
    getProfile
);

router.put(
    '/', 
    protect, 
    profileValidator, 
    validate, 
    updateProfile
);

export default router;