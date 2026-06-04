import { body } from 'express-validator';

export const createJobValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 3 })
    .withMessage('Job title must be at least 3 characters long'),
  
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 20 })
    .withMessage('Job description must be at least 20 characters long'),
  
  body('requirements')
    .trim()
    .notEmpty()
    .withMessage('Job requirements are required'),
  
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Job type is required')
    .isIn(['full-time', 'part-time', 'contract', 'remote'])
    .withMessage('Invalid job type'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  
  body('salary')
    .optional()
    .trim(),
  
  body('benefits')
    .optional()
    .trim()
];