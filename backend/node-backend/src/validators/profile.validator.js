import { body } from 'express-validator';

export const profileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage('Invalid phone number format'),
  
  body('location')
    .optional()
    .trim(),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  
  body('company')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 2 })
    .withMessage('Company name must be at least 2 characters long'),
  
  body('position')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 2 })
    .withMessage('Position must be at least 2 characters long')
];