import { body } from 'express-validator';

export const applicationStatusValidator = [
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ min: 50 })
    .withMessage('Cover letter must be at least 50 characters long'),
  
  body('file')
    .notEmpty()
    .withMessage('Resume file is required')
];